import { ethers } from 'ethers';

export class SoftwareWalletProvider {
    #popup = null;
    #keystoreFile = null;
    #address = '';
    #chainId = '';
    #sendTransactionFunc = null;
    /** @type {Api} */
    #api = {};

    constructor(softwareWalletPopup = null, api = {}) {
        this.#popup = softwareWalletPopup;
        this.#api = api;
    }

    init({ keystoreFile, address, chainId }) {
        this.#keystoreFile = keystoreFile;
        this.#address = address;
        this.#chainId = chainId;
    }

    /**
     * @param {Transaction} transaction
     * @return {Promise<{ status: WalletTransactionStatus, data: SignedTransaction|Error|null}>}
     */
    async signTransaction(transaction) {
        const result = await this.#showPopup(transaction);
        const { status } = result;
        let data;

        if (status === 'success') {
            data = await this.#signTransaction(result.data.transaction, result.data.wallet);
        } else {
            data = result.data;
        }

        this.#hidePopup();

        return { status, data };
    }

    /**
     * @param {Transaction} transaction
     * @return {Promise<{ status: WalletTransactionStatus, data: SignedTransaction|Error|null}>}
     */
    async sendTransaction(transaction) {
        const result = await this.#showPopup(transaction);
        const { status } = result;
        let data;

        if (status === 'success') {
            data = await this.#signTransaction(result.data.transaction, result.data.wallet);
            data = await this.#sendTransaction(data.rawTransaction);
        } else {
            data = result.data;
        }

        this.#hidePopup();

        return { status, data };
    }

    /**
     * @param {Transaction} transaction
     * @return {Promise<*>}
     */
    async #showPopup(transaction) {
        if (!this.#isSetCorrectly()) {
            throw new Error('SoftwareWalletProvider is not set correctly');
        }

        return this.#popup.show({ transaction, keystoreFile: this.#keystoreFile });
    }

    #hidePopup() {
        this.#popup.hide();
    }

    /**
     * @param {Transaction} transaction
     * @param {Object} wallet
     * @return {Promise<SignedTransaction>}
     */
    async #signTransaction(transaction, wallet) {
        const signedTX = await wallet.signTransaction(transaction);
        const parsedSignedTX = ethers.utils.parseTransaction(signedTX);

        return {
            rawTransaction: signedTX,
            transactionHash: parsedSignedTX.hash,
        };
    }

    async #sendTransaction(rawTransaction) {
        if (this.#sendTransactionFunc === null) {
            const { mutate, getPromise } = this.#api.mutation.sendTransaction();

            this.#sendTransactionFunc = (rawTx) => {
                mutate({ transaction: rawTx });

                return getPromise();
            };
        }

        return this.#sendTransactionFunc(rawTransaction);
    }

    #isSetCorrectly() {
        return this.#keystoreFile !== null && this.#popup !== null;
    }
}
