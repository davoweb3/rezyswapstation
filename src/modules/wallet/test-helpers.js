export class WalletMock {
    _signTransactionArgs = [];
    _sendTransactionArgs = [];

    async signTransaction(...args) {
        this._signTransactionArgs.push(args);
    }
    async sendTransaction(...args) {
        this._sendTransactionArgs.push(args);
    }
}
