import { FULL_TRANSACTION, TEST_ACCOUNT_ADDRESS, TEST_ACCOUNT_ADDRESS2 } from '@/plugins/web3-wallets/test-helpers.js';
import { useApi } from 'fantom-vue3-components';
import { vi } from 'vitest';
import { getLedgerProviderMock } from '@/plugins/web3-wallets/Ledger/test-helpers.js';

const api = useApi().api;
let provider = null;
let notifications = null;
let transactionPopup = null;

class NotificationsMock {
    add() {}
}

class LedgerTransactionConfirmationPopupMock {
    show() {}
    hide() {}
}

function createProvider({ apii = api, fantomNanoError = null } = {}) {
    notifications = new NotificationsMock();
    transactionPopup = new LedgerTransactionConfirmationPopupMock();
    provider = getLedgerProviderMock({ api: apii, notifications, fantomNanoError, transactionPopup });
}

function destroyProvider() {
    provider = null;
    notifications = null;
    transactionPopup = null;
}

function initProvider() {
    provider.init({
        accountId: 0,
        addressId: 0,
        address: TEST_ACCOUNT_ADDRESS,
        chainId: '0xfa',
    });
}

beforeEach(() => {
    createProvider();
});

afterEach(() => {
    destroyProvider();
    vi.restoreAllMocks();
});

describe('LedgerProvider', () => {
    it('should get the version', async () => {
        expect(await provider.getVersion()).toBe(1);
    });

    it('should get ledger account', async () => {
        expect(await provider.getLedgerAccount(0, 1)).toEqual({
            address: TEST_ACCOUNT_ADDRESS2,
            accountId: 0,
            addressId: 1,
        });
    });

    it('should display notification if an error occurs', async () => {
        const error = new Error('an error');

        destroyProvider();
        createProvider({ fantomNanoError: error });

        const addNotificationSpy = vi.spyOn(notifications, 'add');

        try {
            await provider.getVersion();
        } catch (e) {
            expect(addNotificationSpy).toHaveBeenCalledWith({
                type: 'error',
                text: error,
            });

            vi.restoreAllMocks();
        }
    });

    describe('transaction signing', () => {
        it('should throw an error if account or address id is not correct', async () => {
            await expect(provider.signTransaction(FULL_TRANSACTION())).rejects.toBeInstanceOf(Error);
        });

        it('should sign transaction', async () => {
            initProvider();

            expect(await provider.signTransaction(FULL_TRANSACTION())).toEqual({
                status: 'success',
                data: {
                    rawTransaction:
                        '0xf865018524ab47394a83028301948ba1f109551bd432803012645ac136ddd64dba7280801ba0a6e699ad3fe618f0907592e33497ee50e6337711b7da37fb8446e17e69c7cda7a00c46014008f7706809048717f07ee6df2ee73c58aafd875667eeccad93faf574',
                    transactionHash: '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795',
                },
            });
        });

        it('should show the popup', async () => {
            const showSpy = vi.spyOn(transactionPopup, 'show');
            const transaction = FULL_TRANSACTION();

            initProvider();
            await provider.signTransaction(transaction);

            expect(showSpy).toHaveBeenCalledWith(transaction);
        });

        it('should hide the popup', async () => {
            const hideSpy = vi.spyOn(transactionPopup, 'hide');

            initProvider();
            await provider.signTransaction(FULL_TRANSACTION());

            expect(hideSpy).toHaveBeenCalled();
        });
    });

    describe('transaction sending', () => {
        it('should throw an error if api is not set correctly', async () => {
            createProvider({ apii: null });
            initProvider();

            await expect(provider.sendTransaction(FULL_TRANSACTION())).rejects.toBeInstanceOf(Error);
        });

        it('should send transaction', async () => {
            initProvider();

            expect(await provider.sendTransaction(FULL_TRANSACTION())).toEqual({
                status: 'success',
                data: '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795',
            });
        });

        it('should show the popup', async () => {
            const showSpy = vi.spyOn(transactionPopup, 'show');
            const transaction = FULL_TRANSACTION();

            initProvider();
            await provider.signTransaction(transaction);

            expect(showSpy).toHaveBeenCalledWith(transaction);
        });

        it('should hide the popup', async () => {
            const hideSpy = vi.spyOn(transactionPopup, 'hide');

            initProvider();
            await provider.signTransaction(FULL_TRANSACTION());

            expect(hideSpy).toHaveBeenCalled();
        });
    });
});
