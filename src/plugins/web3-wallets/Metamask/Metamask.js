import { Web3Wallet, Web3WalletError } from '../Web3Wallet/Web3Wallet.js';
import detectEthereumProvider from '@metamask/detect-provider';
import { toHex } from '@/utils/big-number/big-number.js';
import { FANTOM_MAINNET, FANTOM_TESTNET } from '@/config/fantom-chain.js';
import { addressesMatch } from '@/utils/account/account.js';
// import { ethers } from 'ethers';

export class Metamask extends Web3Wallet {
    #provider = null;
    #installed = false;
    #ftmInfo = {
        name: 'Fantom',
        symbol: FANTOM_MAINNET.currencySymbol,
        decimals: 18,
    };
    #defaulChainId = '';
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

    constructor({ name = 'metamask', walletEventsListener = null, defaulChainId = '0xfa' }) {
        super({ name, walletEventsListener });

        this.#defaulChainId = defaulChainId;
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
            // const ret = this.#provider ? await this.#provider.getSigner().sendTransaction(transaction) : null;
            const hash = await this.#provider.request({
                method: 'eth_sendTransaction',
                params: [transaction],
            });

            return {
                status: 'success',
                data: hash,
                // data: ret.hash,
            };
        } catch (error) {
            /*if (error.code === 4001) {
                return {
                    status: 'rejected',
                };
            }

            console.log('eokjpoij');*/

            return {
                status: 'rejected',
            };
        }
    }

    async disconnect() {
        /*if (this.#provider) {
            this.#provider.close();
        }*/
        await this._disconnect();
    }

    async activate(currentAddress = '') {
        const address = (await this.#requestAccounts())[0];

        if (addressesMatch(address, currentAddress)) {
            await this.#setAddress(address);
        }

        return address;
    }

    isInstalled() {
        return this.#installed;
    }

    install() {
        const url = new URL(window.location.href);

        if (url.host.indexOf('sandbox.pbro') > -1) {
            window.location.href = 'https://metamask.app.link/dapp/sandbox.pbro.zenithies.dev/tmp/';
        } else {
            window.location.href = `https://metamask.app.link/dapp/${url.host}/`;
        }
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
        this.#provider = provider === null ? await this.#getProvider() : provider;

        if (this.#provider) {
            this.#setEventListeners();
            await this.#setChainId();
            if (activate) {
                await this.#setAddress();
            }
        } else if (!this.isInstalled()) {
            this.install();
        }
    }

    #setEventListeners() {
        const provider = this.#provider;

        if (provider) {
            provider.on('chainChanged', (chainId) => {
                this.chainId = chainId;
            });
            provider.on('accountsChanged', (address) => {
                if (!addressesMatch(this.address, address[0])) {
                    this.address = address[0];
                }
            });
        }
    }

    async #setChainId() {
        const provider = this.#provider;

        if (provider) {
            this.chainId = provider.chainId || this.#defaulChainId;
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
                console.log('requestAccounts');
                return await this.#provider.request({ method: 'eth_requestAccounts' });
            } catch (error) {
                // userRejectedRequest error
                if (error.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(error);
                }

                throw new Error(error.message);
            }
        }
    }

    async #getProvider() {
        let provider = await detectEthereumProvider();

        if (provider) {
            if (provider === window.ethereum) {
                // provider = new ethers.providers.Web3Provider(provider);
                this.#installed = true;
            } else {
                throw new Error('Do you have multiple wallets installed?');
            }
        }

        return provider || null;
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
