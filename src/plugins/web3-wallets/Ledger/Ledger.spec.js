import { implementsInterface } from 'fantom-vue3-components/src/utils/interface/interface.js';
import { Web3WalletInterface } from '@/plugins/web3-wallets/Web3WalletInterface.js';
import { vi } from 'vitest';
import { Ledger } from './Ledger.js';
import { Web3WalletError } from '@/plugins/web3-wallets/Web3Wallet/Web3Wallet.js';
import { FULL_TRANSACTION, ProviderMock } from '../test-helpers.js';

let wallet = null;

function createWallet() {
    wallet = new Ledger({ address: '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb' });
    wallet.init({
        accountId: 0,
        addressId: 0,
        address: '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb',
        chainId: '0xfa',
    });
}

beforeAll(() => {
    Ledger.setProvider(new ProviderMock());
});

beforeEach(() => {
    createWallet();
});

afterEach(() => {
    wallet = null;
    vi.restoreAllMocks();
});

describe('Ledger', () => {
    it('should implement Web3Wallet interface', () => {
        expect(() => {
            implementsInterface(wallet, Web3WalletInterface);
        }).not.toThrowError();
    });

    it('should set ledger provider', () => {
        Ledger.setProvider(new ProviderMock());

        expect(Ledger.isProviderSet()).toBe(true);
    });

    it('should initialize provider with correct data', () => {
        const provider = new ProviderMock();
        const initSpy = vi.spyOn(provider, 'init');
        Ledger.setProvider(provider);

        wallet.init({
            accountId: 0,
            addressId: 0,
            chainId: '0xfa',
        });

        expect(initSpy).toHaveBeenCalledWith({
            accountId: 0,
            addressId: 0,
            address: '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb',
            chainId: '0xfa',
        });

        Ledger.setProvider(new ProviderMock());
    });

    describe('transaction signing', () => {
        it('should throw an error if the given transaction object is not in a valid form', async () => {
            await expect(
                wallet.signTransaction({
                    transaction: {},
                })
            ).rejects.toBeInstanceOf(Web3WalletError);
        });

        it('should not check transaction object validity if `contractDeployment` argument is `true`', async () => {
            await expect(
                wallet.signTransaction({
                    contractDeployment: true,
                    transaction: {},
                })
            ).resolves;
        });

        it('should sign a transaction', async () => {
            expect(
                await wallet.signTransaction({
                    transaction: FULL_TRANSACTION(),
                })
            ).toEqual({
                status: 'success',
                data: {
                    rawTransaction:
                        '0xf865018524ab47394a83028301948ba1f109551bd432803012645ac136ddd64dba7280801ba0a6e699ad3fe618f0907592e33497ee50e6337711b7da37fb8446e17e69c7cda7a00c46014008f7706809048717f07ee6df2ee73c58aafd875667eeccad93faf574',
                    transactionHash: '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795',
                },
            });
        });
    });

    describe('transaction sending', () => {
        it('should throw an error if the given transaction object is not in a valid form', async () => {
            await expect(
                wallet.sendTransaction({
                    transaction: {},
                })
            ).rejects.toBeInstanceOf(Web3WalletError);
        });

        it('should not check transaction object validity if `contractDeployment` argument is `true`', async () => {
            await expect(
                wallet.sendTransaction({
                    contractDeployment: true,
                    transaction: {},
                })
            ).resolves;
        });

        it('should send a transaction', async () => {
            expect(
                await wallet.sendTransaction({
                    transaction: FULL_TRANSACTION(),
                })
            ).toEqual({
                status: 'success',
                data: '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795',
            });
        });
    });
});
