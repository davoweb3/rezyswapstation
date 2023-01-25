import { useApi } from 'fantom-vue3-components';
import { LedgerProvider } from '@/plugins/web3-wallets/Ledger/LedgerProvider/LedgerProvider.js';
import { TEST_ACCOUNT_ADDRESS, TEST_ACCOUNT_ADDRESS2 } from '@/plugins/web3-wallets/test-helpers.js';

class FantomNanoMock {
    static _error = null;

    _addresses = [TEST_ACCOUNT_ADDRESS, TEST_ACCOUNT_ADDRESS2];

    async signTransaction() {
        this._throwError();

        return {
            raw: '0xf865018524ab47394a83028301948ba1f109551bd432803012645ac136ddd64dba7280801ba0a6e699ad3fe618f0907592e33497ee50e6337711b7da37fb8446e17e69c7cda7a00c46014008f7706809048717f07ee6df2ee73c58aafd875667eeccad93faf574',
        };
    }

    async getVersion() {
        this._throwError();

        return 1;
    }

    async getAddress(accountId, addressId = 0) {
        this._throwError();

        return this._addresses[addressId < 2 ? addressId : 0];
    }

    async listAddresses() {
        this._throwError();
    }

    _throwError() {
        if (FantomNanoMock._error) {
            throw FantomNanoMock._error;
        }
    }
}

class TransportMock {
    static async create() {
        return {
            setExchangeTimeout() {},
            close() {},
        };
    }

    static async close() {}

    static async open() {}

    static async listen() {}

    static async send() {}

    static async exchange() {}
}

export function getLedgerProviderMock({
    api = useApi().api,
    useU2FTransport = false,
    fantomNanoError = null,
    notifications = null,
    transactionPopup = null,
} = {}) {
    FantomNanoMock._error = fantomNanoError || null;

    return new LedgerProvider({
        Bridge: FantomNanoMock,
        U2FTransport: TransportMock,
        WebHIDTransport: TransportMock,
        api,
        useU2FTransport,
        notifications,
        transactionPopup,
    });
}
