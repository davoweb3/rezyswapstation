import { ethers } from 'ethers';
import { Web3Wallet, Web3WalletError } from '../Web3Wallet/Web3Wallet.js';

export class SoftwareWallet extends Web3Wallet {
    static #provider = null;

    #keystoreFile = null;

    constructor({ name = 'software_wallet', walletEventsListener = null }) {
        super({ name, walletEventsListener });
    }

    async init({ keystoreFile = null, chainId = '0xfa' } = {}) {
        this.chainId = chainId;

        if (keystoreFile) {
            this.setFromKeystoreFile(keystoreFile);
        }
    }

    async disconnect() {
        this.#keystoreFile = null;

        await this._disconnect();
    }

    async activate(currentAddress = '') {
        if (currentAddress) {
            this.address = currentAddress;
            this.active = true;
        }
    }

    setFromKeystoreFile(keystoreFile) {
        if (!SoftwareWallet.isKeystoreFile(keystoreFile)) {
            throw new Web3WalletError('Not a valid keystore file');
        } else {
            this.#keystoreFile = keystoreFile;
            this.address = ethers.utils.getAddress(keystoreFile.address);

            SoftwareWallet.#getProvider().init({ keystoreFile, address: this.address, chainId: this.chainId });
        }
    }

    /**
     * @param {Transaction} transaction
     * @param {boolean} [contractDeployment]
     * @return {Promise<WalletSignTransactionData>}
     */
    async signTransaction({ transaction = {}, contractDeployment = false } = {}) {
        if (!contractDeployment && !this.isTransactionObjectValid(transaction)) {
            throw new Web3WalletError('Not a valid transaction object');
        }

        return await SoftwareWallet.#getProvider().signTransaction(transaction);

        /*try {
            const result = await SoftwareWallet.#getProvider().signTransaction(transaction);

            return result.status === 'success' ? result.data : null;
        } catch (error) {
            if (error.message.includes('invalid password')) {
                throw new Web3WalletError('Invalid password');
            } else if (error.message.includes('invalid JSON wallet')) {
                throw new Web3WalletError('Invalid JSON wallet');
            } else {
                throw error;
            }
        }*/
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

        return await SoftwareWallet.#getProvider().sendTransaction(transaction);
    }

    static isKeystoreFile(object) {
        return (
            !!object &&
            typeof object === 'object' &&
            object.version === 3 &&
            'address' in object &&
            ('crypto' in object || 'Crypto' in object)
        );
    }

    static isPrivateKey(privateKey) {
        return ethers.utils.isHexString(privateKey) && privateKey.length === 66;
    }

    static async privateKeyToKeystoreFile(privateKey, password) {
        const wallet = new ethers.Wallet(privateKey);

        return JSON.parse(await wallet.encrypt(password));
    }

    static async mnemonicPhraseToKeystoreFile(mnemonicPhrase, password) {
        const wallet = ethers.Wallet.fromMnemonic(mnemonicPhrase);

        return JSON.parse(await wallet.encrypt(password));
    }

    static setProvider(provider) {
        SoftwareWallet.#provider = provider;
    }

    static isProviderSet() {
        return SoftwareWallet.#provider !== null;
    }

    static #getProvider() {
        if (!SoftwareWallet.isProviderSet()) {
            throw new Error('Need a software wallet provider to be set');
        }

        return SoftwareWallet.#provider;
    }
}
