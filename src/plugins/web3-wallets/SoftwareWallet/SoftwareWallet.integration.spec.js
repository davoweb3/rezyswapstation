import { SoftwareWallet } from './SoftwareWallet.js';
import {
    FULL_TRANSACTION,
    ProviderMock,
    TEST_ACCOUNT_ADDRESS,
    TEST_ACCOUNT_KEYSTORE_FILE,
    TEST_ACCOUNT_MNEMONIC,
    TEST_ACCOUNT_PASSWORD,
    TEST_ACCOUNT_PRIVATE_KEY,
} from '../test-helpers.js';
import { implementsInterface } from 'fantom-vue3-components/src/utils/interface/interface.js';
import { Web3WalletInterface } from '../Web3WalletInterface.js';
import { Web3WalletError } from '../Web3Wallet/Web3Wallet.js';
import { vi } from 'vitest';

let wallet = null;

function createWallet({ walletEventsListener = null } = {}) {
    wallet = new SoftwareWallet({ walletEventsListener });
    wallet.init({ keystoreFile: TEST_ACCOUNT_KEYSTORE_FILE() });
}

beforeAll(() => {
    SoftwareWallet.setProvider(new ProviderMock());
});

beforeEach(() => {
    createWallet();
});

afterEach(() => {
    wallet = null;
    vi.restoreAllMocks();
});

describe('SoftwareWallet', () => {
    it('should check if given object is keystore file', () => {
        expect(SoftwareWallet.isKeystoreFile({})).toBe(false);
        expect(SoftwareWallet.isKeystoreFile(TEST_ACCOUNT_KEYSTORE_FILE())).toBe(true);
    });

    it('should check if given private key has correct format', () => {
        expect(SoftwareWallet.isPrivateKey(TEST_ACCOUNT_PRIVATE_KEY)).toBe(true);
        expect(SoftwareWallet.isPrivateKey('0x123')).toBe(false);
    });

    it('should implement Web3Wallet interface', () => {
        expect(() => {
            implementsInterface(wallet, Web3WalletInterface);
        }).not.toThrowError();
    });

    it('should set software wallet provider', () => {
        SoftwareWallet.setProvider(new ProviderMock());

        expect(SoftwareWallet.isProviderSet()).toBe(true);
    });

    it('should initialize provider with correct data', () => {
        const provider = new ProviderMock();
        const keystoreFile = TEST_ACCOUNT_KEYSTORE_FILE();
        const initSpy = vi.spyOn(provider, 'init');
        SoftwareWallet.setProvider(provider);

        wallet.setFromKeystoreFile(keystoreFile);

        expect(initSpy).toHaveBeenCalledWith({
            keystoreFile,
            address: '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb',
            chainId: '0xfa',
        });
    });

    describe.skip('wallet setting', () => {
        it('should create keystore file from private key', async () => {
            const keystoreFile = await SoftwareWallet.privateKeyToKeystoreFile(
                TEST_ACCOUNT_PRIVATE_KEY,
                TEST_ACCOUNT_PASSWORD
            );

            expect(SoftwareWallet.isKeystoreFile(keystoreFile)).toBe(true);
            expect(`0x${keystoreFile.address.toLowerCase()}`).toBe(TEST_ACCOUNT_ADDRESS.toLocaleLowerCase());
        });

        it('should create keystore file from mnemonic phrase', async () => {
            const keystoreFile = await SoftwareWallet.mnemonicPhraseToKeystoreFile(
                TEST_ACCOUNT_MNEMONIC,
                TEST_ACCOUNT_PASSWORD
            );

            expect(SoftwareWallet.isKeystoreFile(keystoreFile)).toBe(true);
            expect(`0x${keystoreFile.address.toLowerCase()}`).toBe(TEST_ACCOUNT_ADDRESS.toLocaleLowerCase());
        });
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
