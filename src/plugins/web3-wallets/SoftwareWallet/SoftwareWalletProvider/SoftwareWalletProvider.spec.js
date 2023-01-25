import { SoftwareWalletProvider } from './SoftwareWalletProvider.js';
import { TEST_ACCOUNT_KEYSTORE_FILE, TEST_ACCOUNT_PASSWORD } from '@/plugins/web3-wallets/test-helpers.js';
import { ethers } from 'ethers';
import { vi } from 'vitest';
import { useApi } from 'fantom-vue3-components';

const api = useApi().api;

let provider = null;
let popup = null;
const TX = {
    from: '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb',
    to: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    gasLimit: '0x28301',
    gasPrice: '0x24ab47394a',
    nonce: '0x1',
};

class SoftwareWalletPopupMock {
    async show({ transaction, keystoreFile }) {
        return (
            transaction.__RESULT__ || {
                status: 'success',
                data: {
                    transaction,
                    wallet: await this.getWallet(keystoreFile, TEST_ACCOUNT_PASSWORD),
                },
            }
        );
    }

    hide() {}

    async getWallet(keystoreFile, password) {
        return ethers.Wallet.fromEncryptedJson(JSON.stringify(keystoreFile), password);
    }
}

beforeEach(() => {
    popup = new SoftwareWalletPopupMock();
    provider = new SoftwareWalletProvider(popup, api);
    provider.init({ keystoreFile: TEST_ACCOUNT_KEYSTORE_FILE() });
});

afterEach(() => {
    popup = null;
    provider = null;
    vi.restoreAllMocks();
});

describe('SoftwareWalletProvider', () => {
    describe('transaction signing', () => {
        it('should throw an error if provider is not set correctly', async () => {
            provider = new SoftwareWalletProvider();

            await expect(provider.signTransaction(TX)).rejects.toBeInstanceOf(Error);
        });

        it('should sign transaction', async () => {
            expect(await provider.signTransaction(TX)).toEqual({
                status: 'success',
                data: {
                    rawTransaction:
                        '0xf865018524ab47394a83028301948ba1f109551bd432803012645ac136ddd64dba7280801ba0a6e699ad3fe618f0907592e33497ee50e6337711b7da37fb8446e17e69c7cda7a00c46014008f7706809048717f07ee6df2ee73c58aafd875667eeccad93faf574',
                    transactionHash: '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795',
                },
            });
        });

        /*it('should return error if something goes wrong', async () => {
            const error = {
                status: 'error',
                data: 'error message',
            };

            expect(await provider.signTransaction({ ...TX, __RESULT__: error })).toEqual({
                status: 'error',
                data: 'error message',
            });
        });*/

        it('should hide the popup', async () => {
            const hideSpy = vi.spyOn(popup, 'hide');

            await provider.signTransaction(TX);

            expect(hideSpy).toHaveBeenCalled();
        });
    });

    describe('transaction sending', () => {
        it('should throw an error if provider is not set correctly', async () => {
            provider = new SoftwareWalletProvider();

            await expect(provider.sendTransaction(TX)).rejects.toBeInstanceOf(Error);
        });

        it('should send transaction', async () => {
            expect(await provider.sendTransaction(TX)).toEqual({
                status: 'success',
                data: '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795',
            });
        });

        /*it('should return error if something goes wrong', async () => {
            const error = {
                status: 'error',
                data: 'error message',
            };

            expect(await provider.sendTransaction({ ...TX, __RESULT__: error })).toEqual({
                status: 'error',
                data: 'error message',
            });
        });*/

        it('should hide the popup', async () => {
            const hideSpy = vi.spyOn(popup, 'hide');

            await provider.sendTransaction(TX);

            expect(hideSpy).toHaveBeenCalled();
        });
    });
});
