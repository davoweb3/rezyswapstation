import FantomNano from 'fantom-clientjs-utils/src/fantom-nano.js';
// import FantomNano from '@/plugins/fantom-nano.js';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { ethers } from 'ethers';
import { adjustLedgerStatusCode, getLedgerErrorMessageByStatusCode } from '@/config/ledger.js';
import { TransferStatus } from '@/plugins/web3-wallets/Ledger/LedgerProvider/transfer-status.js';

export class LedgerProvider {
    static _transport = null;

    _Bridge = null;
    _U2FTransport = null;
    _WebHIDTransport = null;
    _accountId = -1;
    _addressId = -1;
    _address = '';
    _chainId = '';
    _useU2FTransport = false;
    _api = null;
    _sendTransactionFunc = null;
    _notifications = null;

    constructor({
        Bridge = FantomNano,
        U2FTransport = TransportU2F,
        WebHIDTransport = TransportWebHID,
        useU2FTransport = false,
        api = null,
        notifications = null,
        transactionPopup = null,
    }) {
        this._Bridge = Bridge;
        this._U2FTransport = U2FTransport;
        this._WebHIDTransport = WebHIDTransport;
        this._useU2FTransport = useU2FTransport;
        this._api = api;
        this._notifications = notifications;
        this._transactionPopup = transactionPopup;
    }

    /**
     * @param {number} accountId
     * @param {number} addressId
     * @param {string} address
     * @param {string} chainId
     * @return {Promise<void>}
     */
    async init({ accountId = -1, addressId = -1, address, chainId }) {
        this._accountId = accountId;
        this._addressId = addressId;
        this._address = address;
        this._chainId = chainId;
    }

    /**
     * @param {Transaction} transaction
     * @return {Promise<{data, status: string}|{data: {rawTransaction, transactionHash: string}, status: string}>}
     */
    async signTransaction(transaction) {
        if (this._accountId < 0 || this._addressId < 0) {
            throw new Error('Need an account and address id');
        }

        const bridge = await this._getBridge();

        if (bridge) {
            try {
                // console.log('SIGN TX', transaction);
                this._showTransactionPopup(transaction);

                const result = await bridge.signTransaction(this._accountId, this._addressId, transaction);
                const signedTX = ethers.utils.hexlify(result.raw);
                const parsedSignedTX = ethers.utils.parseTransaction(signedTX);

                // console.log('parsedSignedTX', parsedSignedTX);

                // console.log('SIGNED TX', result);
                // console.log('SIGNED TX ser', ethers.utils.hexlify(result.raw));

                this._hideTransactionPopup();

                return {
                    status: 'success',
                    data: {
                        rawTransaction: signedTX,
                        transactionHash: parsedSignedTX.hash,
                    },
                };
            } catch (error) {
                this._hideTransactionPopup();
                this._displayError(error);
                await this._closeTransport();

                const ret = {
                    status: 'error',
                    data: error,
                };

                if (
                    error.statusCode === TransferStatus.USER_REJECTED_REQUESTED_ACTION ||
                    error.statusCode === TransferStatus.DEVICE_LOCKED ||
                    error.statusCode === TransferStatus.DEVICE_ACCESS_DENIED ||
                    error.statusCode === TransferStatus.DEVICE_INELIGIBLE
                ) {
                    ret.status = 'rejected';
                }

                return ret;
            }
        }
    }

    async sendTransaction(transaction) {
        const result = await this.signTransaction(transaction);
        const { status } = result;
        let data;

        if (result.status === 'success') {
            data = await this._sendTransaction(result.data.rawTransaction);
        } else {
            data = result.data;
        }

        return { status, data };
    }

    async _sendTransaction(rawTransaction) {
        if (!this._api || typeof this._api.mutation?.sendTransaction !== 'function') {
            throw new Error('Api or sendTransaction mutation is not set');
        }

        if (this._sendTransactionFunc === null) {
            const { mutate, getPromise } = this._api.mutation.sendTransaction();

            this._sendTransactionFunc = (rawTx) => {
                mutate({ transaction: rawTx });

                return getPromise();
            };
        }

        return this._sendTransactionFunc(rawTransaction);
    }

    /**
     * @return {Promise<number>}
     */
    async getVersion(throwError = false) {
        const bridge = await this._getBridge();
        let version = 0;

        if (bridge) {
            try {
                version = await bridge.getVersion();
            } catch (error) {
                await this._closeTransport(error, throwError);
            }
        }

        return version;
    }

    /**
     * @param {number} [accountId]
     * @param {number} [addressId]
     * @param {boolean} [confirmAddress]
     * @return {Promise<{accountId: number, address: string, addressId: number}>}
     */
    async getLedgerAccount(accountId = 0, addressId = 0, confirmAddress = true) {
        const bridge = await this._getBridge();
        const account = {
            address: '',
            accountId,
            addressId,
        };

        if (bridge) {
            try {
                account.address = await bridge.getAddress(accountId, addressId, confirmAddress);
            } catch (error) {
                await this._closeTransport(error);
            }
        }

        return account;
    }

    async _getBridge() {
        const transport = await this._getTransport();

        let bridge = null;

        if (transport) {
            bridge = new this._Bridge(transport);
        }

        return bridge;
    }

    async _getTransport() {
        let transport = null;

        if (this._useU2FTransport) {
            transport = await this._U2FTransport.create();
        } else {
            if (!LedgerProvider._transport) {
                try {
                    LedgerProvider._transport = await this._WebHIDTransport.create();
                } catch (error) {
                    await this._closeTransport(error);
                }
            }

            if (LedgerProvider._transport) {
                transport = LedgerProvider._transport;
            }
        }

        if (transport && typeof transport.setExchangeTimeout === 'function') {
            transport.setExchangeTimeout(300000);
        }

        return transport;
    }

    async _closeTransport(error, forceError) {
        if (LedgerProvider._transport) {
            await LedgerProvider._transport.close();
            LedgerProvider._transport = null;
        }

        if (error) {
            const throwError = this._displayError(error);

            if (throwError || forceError) {
                throw new Error(error);
            }
        }
    }

    _displayError(error) {
        let throwError = true;

        if (this._notifications) {
            adjustLedgerStatusCode(error);

            const errorMessage = getLedgerErrorMessageByStatusCode(error.statusCode);

            if (errorMessage) {
                this._showNotification({
                    type: 'info',
                    text: errorMessage,
                });

                throwError = false;
            } else {
                this._showNotification({
                    type: 'error',
                    text: error,
                });
            }
        }

        return throwError;
    }

    /**
     * @param { type: string, text: string} notification
     */
    _showNotification(notification) {
        if (this._notifications) {
            this._notifications.add(notification);
        }
    }

    /**
     * @param {Transaction} transaction
     * @private
     */
    _showTransactionPopup(transaction) {
        if (this._transactionPopup) {
            this._transactionPopup.show(transaction);
        }
    }

    _hideTransactionPopup() {
        if (this._transactionPopup) {
            this._transactionPopup.hide();
        }
    }
}
