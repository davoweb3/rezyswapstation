import { Web3Wallet, Web3WalletError } from '../Web3Wallet/Web3Wallet.js';

export class Ledger extends Web3Wallet {
    static #provider = null;

    #address = '';
    #accountId = -1;
    #addressId = -1;

    constructor({ name = 'ledger', address = '', walletEventsListener = null } = {}) {
        super({ name, walletEventsListener });

        this.#address = address;
    }

    async init({ accountId, addressId, chainId = '0xfa' }) {
        this.chainId = chainId;
        this.#accountId = accountId;
        this.#addressId = addressId;

        this.address = this.#address;

        this.#initProvider();
    }

    #initProvider({
        accountId = this.#accountId,
        addressId = this.#addressId,
        address = this.#address,
        chainId = this.chainId,
    } = {}) {
        Ledger.#getProvider().init({ accountId, addressId, address, chainId });
    }

    async disconnect() {
        await this._disconnect();
    }

    async activate(currentAddress = '') {
        if (currentAddress) {
            this.address = currentAddress;
            this.#initProvider({ address: this.address });
            this.active = true;
        }
    }

    /**
     * @param {Transaction} transaction
     * @param {boolean} [contractDeployment]
     * @return {Promise<WalletSignTransactionData>}
     */
    async signTransaction({ transaction = {}, contractDeployment = false } = {}) {
        this.#checkArgs({ transaction, contractDeployment });

        return await Ledger.#getProvider().signTransaction(transaction);
    }

    /**
     * @param {Transaction} transaction
     * @param {boolean} [contractDeployment]
     * @return {Promise<WalletSendTransactionData>}
     */
    async sendTransaction({ transaction = {}, contractDeployment = false } = {}) {
        this.#checkArgs({ transaction, contractDeployment });

        return await Ledger.#getProvider().sendTransaction(transaction);
    }

    #checkArgs({ transaction, contractDeployment } = {}) {
        if (!contractDeployment && !this.isTransactionObjectValid(transaction)) {
            throw new Web3WalletError('Not a valid transaction object');
        }
    }

    static setProvider(provider) {
        Ledger.#provider = provider;
    }

    static isProviderSet() {
        return Ledger.#provider !== null;
    }

    static #getProvider() {
        if (!Ledger.isProviderSet()) {
            throw new Error('Need a software wallet provider to be set');
        }

        return Ledger.#provider;
    }
}
