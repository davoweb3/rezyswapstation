import { vi } from 'vitest';
import { FULL_TRANSACTION, ProviderMock, TEST_TRANSACTION_HASH } from '../test-helpers.js';
import { Coinbase } from './Coinbase.js';
import { implementsInterface } from 'fantom-vue3-components/src/utils/interface/interface.js';
import { Web3WalletInterface } from '@/plugins/web3-wallets/Web3WalletInterface.js';
import { Web3WalletError } from '@/plugins/web3-wallets/Web3Wallet/Web3Wallet.js';

let wallet = null;
let provider = null;

async function createWallet({ walletEventsListener = null, providerOptions = {}, withoutProvder = false } = {}) {
    provider = !withoutProvder ? new ProviderMock(providerOptions) : null;
    wallet = new Coinbase({ walletEventsListener });
    wallet.init({ provider });
}

function destroyWallet() {
    provider = null;
    wallet = null;
}

beforeEach(() => {
    createWallet();
});

afterEach(() => {
    destroyWallet();
    vi.restoreAllMocks();
});

describe('Coinbase wallet', () => {
    it('should implement Web3Wallet interface', () => {
        expect(() => {
            implementsInterface(wallet, Web3WalletInterface);
        }).not.toThrowError();
    });

    describe('sendTransaction()', () => {
        it('should throw an error if the given transaction object is not in a valid form', async () => {
            await expect(
                wallet.sendTransaction({
                    transaction: {},
                })
            ).rejects.toBeInstanceOf(Web3WalletError);
        });

        it('should return status "rejected" if en error occurs while sending a transaction', async () => {
            destroyWallet();
            createWallet({ providerOptions: { requestErrors: { eth_sendTransaction: new Error('foo') } } });

            expect(await wallet.sendTransaction({ transaction: FULL_TRANSACTION() })).toEqual({ status: 'rejected' });
        });

        it('should return status and a hash if transaction is send', async () => {
            expect(await wallet.sendTransaction({ transaction: FULL_TRANSACTION() })).toEqual({
                status: 'success',
                data: TEST_TRANSACTION_HASH,
            });
        });
    });

    describe('switchChain()', () => {
        it('should switch chain with the given chain id in hex format', async () => {
            const requestSpy = vi.spyOn(provider, 'request');

            await wallet.switchChain('0xfa');

            expect(requestSpy).toHaveBeenCalledWith({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xfa' }],
            });
        });

        it('should switch chain with the given chain id as a number', async () => {
            const requestSpy = vi.spyOn(provider, 'request');

            await wallet.switchChain(250);

            expect(requestSpy).toHaveBeenCalledWith({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xfa' }],
            });
        });
    });

    describe('addChain()', () => {
        it('should return null if chain info is not found by given chain id', async () => {
            expect(await wallet.addChain('0xfaaa')).toBeNull();
        });

        it('should switch chain with the given chain id in hex format', async () => {
            const requestSpy = vi.spyOn(provider, 'request');

            await wallet.addChain('0xfa');

            expect(requestSpy).toHaveBeenCalledWith({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: '0xfa',
                        chainName: 'Fantom Opera',
                        nativeCurrency: {
                            name: 'Fantom',
                            symbol: 'FTM',
                            decimals: 18,
                        },
                        rpcUrls: ['https://rpc.ftm.tools/'],
                        blockExplorerUrls: ['https://ftmscan.com', 'https://explorer.fantom.network/'],
                    },
                ],
            });
        });

        it('should switch chain with the given chain id as a number', async () => {
            const requestSpy = vi.spyOn(provider, 'request');

            await wallet.addChain(250);

            expect(requestSpy).toHaveBeenCalledWith({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: '0xfa',
                        chainName: 'Fantom Opera',
                        nativeCurrency: {
                            name: 'Fantom',
                            symbol: 'FTM',
                            decimals: 18,
                        },
                        rpcUrls: ['https://rpc.ftm.tools/'],
                        blockExplorerUrls: ['https://ftmscan.com', 'https://explorer.fantom.network/'],
                    },
                ],
            });
        });
    });
});
