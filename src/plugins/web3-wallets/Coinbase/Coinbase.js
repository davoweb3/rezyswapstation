import { Web3Wallet, Web3WalletError } from '../Web3Wallet/Web3Wallet.js';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { toHex, toInt } from '@/utils/big-number/big-number.js';
import { FANTOM_MAINNET, FANTOM_TESTNET } from '@/config/fantom-chain.js';
import { addressesMatch } from '@/utils/account/account.js';

export class Coinbase extends Web3Wallet {
    #provider = null;
    /** @type {CoinbaseOptions} */
    #options = {};
    #coinbaseWallet = null;
    #ftmInfo = {
        name: 'Fantom',
        symbol: FANTOM_MAINNET.currencySymbol,
        decimals: 18,
    };
    #chainInfos = {
        '0xfa': {
            chainId: FANTOM_MAINNET.chainId,
            chainName: FANTOM_MAINNET.name,
            nativeCurrency: this.#ftmInfo,
            rpcUrls: [FANTOM_MAINNET.rpc],
            blockExplorerUrls: [FANTOM_MAINNET.explorer, 'https://explorer.fantom.network/'],
        },
        '0xfa2': {
            chainId: FANTOM_TESTNET.chainId,
            chainName: FANTOM_TESTNET.name,
            nativeCurrency: this.#ftmInfo,
            rpcUrls: [FANTOM_TESTNET.rpc],
            blockExplorerUrls: [FANTOM_TESTNET.explorer],
        },
    };

    /**
     * @param {string} name
     * @param {function} walletEventsListener
     * @param {CoinbaseOptions} options
     */
    constructor({ name = 'coinbase', walletEventsListener = null, options = {} }) {
        super({ name, walletEventsListener });

        this.#options = options;
    }

    async init({ activateOnInit = true, address = '', provider = null }) {
        if (this.#provider === null) {
            await this.#initProvider(provider, activateOnInit);
        }

        if (!activateOnInit && address) {
            this.address = address;
        }
    }

    /**
     * @param {Transaction} transaction
     * @param {boolean} [contractDeployment]
     * @return {Promise<WalletSendTransactionData>}
     */
    async sendTransaction({ transaction = {}, contractDeployment = false } = {}) {
        if (!contractDeployment && !this.isTransactionObjectValid(transaction)) {
            throw new Web3WalletError('Not a valid transaction object');
        }

        if (!this.#provider) {
            throw new Web3WalletError('A provider is not set');
        }

        try {
            const hash = await this.#provider.request({
                method: 'eth_sendTransaction',
                params: [transaction],
            });

            return {
                status: 'success',
                data: hash,
            };
        } catch (error) {
            return {
                status: 'rejected',
            };
        }
    }

    async disconnect() {
        if (this.#coinbaseWallet) {
            if (this.isActive()) {
                this.#coinbaseWallet.disconnect();
            }
            this.#coinbaseWallet = null;
        }

        await this._disconnect();
    }

    async activate(currentAddress = '') {
        const address = (await this.#requestAccounts())[0];

        if (addressesMatch(address, currentAddress)) {
            await this.#setAddress(address);
        }

        return address;
    }

    /**
     * @param {string|number} chainId
     * @return {Promise<null>}
     */
    async switchChain(chainId) {
        const provider = this.#provider;
        let ret = null;

        if (provider) {
            ret = provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: toHex(chainId) }],
            });
        }

        return ret;
    }

    /**
     * @param {string|number} chainId
     * @return {Promise<null>}
     */
    async addChain(chainId) {
        const provider = this.#provider;
        const chainInfo = this.#getChainInfoByChainId(toHex(chainId));
        let ret = null;

        if (provider && chainInfo) {
            ret = provider.request({
                method: 'wallet_addEthereumChain',
                params: [{ ...chainInfo }],
            });
        }

        return ret;
    }

    async #initProvider(provider = null, activate) {
        this.#provider = provider === null ? this.#getProvider() : provider;

        if (this.#provider) {
            this.#setEventListeners();
            await this.#setChainId();
            if (activate) {
                await this.#setAddress();
            }
        }
    }

    #setEventListeners() {
        const provider = this.#provider;

        if (provider) {
            // it doesn't work, but ...
            provider.on('chainChanged', (chainId) => {
                this.chainId = chainId;
            });
            provider.on('accountsChanged', (address) => {
                this.address = address[0];
            });
        }
    }

    async #setChainId() {
        const provider = this.#provider;

        if (provider) {
            this.chainId = provider.chainId;
            // this.chainId = (await provider.getNetwork()).chainId;
        }
    }

    async #setAddress(address = '') {
        const provider = this.#provider;
        let addr = address;

        if (provider && !addr) {
            addr = (await this.#getAccounts())[0];
            if (!addr) {
                addr = (await this.#requestAccounts())[0];
            }
        }

        if (addr) {
            this.address = addr;
            this.active = true;
        }
    }

    /**
     * @return {Promise<[]>}
     */
    async #getAccounts() {
        let accounts = [];

        if (this.#provider) {
            accounts = await this.#provider.request({ method: 'eth_accounts' });
        }

        return accounts;
    }

    /**
     * @return {Promise<*>}
     */
    async #requestAccounts() {
        if (this.#provider) {
            try {
                return await this.#provider.request({ method: 'eth_requestAccounts' });
            } catch (error) {
                // userRejectedRequest error
                if (error.code === 4001) {
                    console.log('select previous account (or none)');
                }

                throw new Error(error.message);
            }
        }
    }

    #getProvider() {
        const options = this.#options;

        this.#coinbaseWallet = new CoinbaseWalletSDK({
            appName: options.appName,
            appLogoUrl: options.appLogoUrl,
            darkMode: options.darkMode || false,
            overrideIsMetaMask: false,
        });

        // console.log(options);
        // console.log(this.#chainInfos[options.defaultChainId].rpcUrls[0]);

        return this.#coinbaseWallet.makeWeb3Provider(
            this.#chainInfos[options.defaultChainId].rpcUrls[0],
            toInt(options.defaultChainId)
        );
    }

    /**
     * @param {string|Object} chainIdOrInfo Chain id in hex format or chain info.
     * @return {Promise<Object|null>}
     */
    #getChainInfoByChainId(chainIdOrInfo) {
        let info;

        if (chainIdOrInfo in this.#chainInfos) {
            info = this.#chainInfos[chainIdOrInfo];
        } else if (typeof chainIdOrInfo === 'object') {
            info = chainIdOrInfo;
        } else {
            info = null;
        }

        return info;
    }
}

/**
 * CoinbaseOptions object
 * @typedef {Object} CoinbaseOptions
 * @property {string} appName
 * @property {string} appLogoUrl
 * @property {number} defaultChainId
 * @property {boolean} [darkMode]
 */
