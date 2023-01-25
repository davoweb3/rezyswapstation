import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import BadChainWarningWindow from './BadChainWarningWindow.vue';
import { i18n } from '@/config/i18n.js';
import { vi } from 'vitest';

let wrapper = null;
let web3Wallet = null;

class Web3WalletMock {
    #errors = {};

    constructor({ errors = {} } = {}) {
        this.#errors = errors;
    }

    async switchChain() {
        this.#throwError('switchChain');
    }

    async addChain() {
        this.#throwError('addChain');
    }

    #throwError(methodName) {
        if (methodName in this.#errors) {
            throw new Error(this.#errors[methodName]);
        }
    }
}

function createWrapper(options = { props: { chainId: '0xfa' } }, web3WalletOptions = {}) {
    web3Wallet = new Web3WalletMock(web3WalletOptions);

    return mount(BadChainWarningWindow, {
        props: {
            ...options.props,
            web3Wallet,
        },
    });
}

afterEach(() => {
    vi.restoreAllMocks();
    web3Wallet = null;
    destroyWrapper(wrapper);
});

describe('BadChainWarningWindow', () => {
    it('should expose FWindow methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.isWindowVisible).toBeDefined();
    });

    it('should display correct text', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();

        expect(wrapper.text()).toContain(
            i18n.t('wallet.badChainWarningWindow.switchChain.message', { chainName: 'Fantom Opera' })
        );
    });

    describe('switching the chain', () => {
        it('should display "switch chain" button', async () => {
            wrapper = createWrapper({
                props: {
                    showSwitchChainButton: true,
                    chainId: '0xfa',
                },
            });

            await wrapper.showWindow();

            expect(wrapper.findByTestId('switch_chain').text()).toContain(
                i18n.t('wallet.badChainWarningWindow.switchChain.buttonLabel', { chainName: 'Fantom Opera' })
            );
        });

        it('should not display "switch chain" button by default', async () => {
            wrapper = createWrapper();

            await wrapper.showWindow();

            expect(wrapper.findByTestId('switch_chain').exists()).toBe(false);
        });

        it('should switch the chain', async () => {
            wrapper = createWrapper({
                props: {
                    showSwitchChainButton: true,
                    chainId: '0xfa',
                },
            });
            const switchChainSpy = vi.spyOn(web3Wallet, 'switchChain');

            await wrapper.showWindow();
            await wrapper.findByTestId('switch_chain').trigger('click');

            expect(switchChainSpy).toHaveBeenCalledWith('0xfa');
        });
    });

    describe('adding a chain', () => {
        it.skip('should display "add chain" button with the expected chain name in it if switching of the chain fails', async () => {
            wrapper = createWrapper(
                {
                    props: {
                        showSwitchChainButton: true,
                        chainId: '0xfa',
                    },
                },
                { errors: { switchChain: 'Unrecognized chain ID' } }
            );

            await wrapper.showWindow();
            await wrapper.findByTestId('switch_chain').trigger('click');

            const addChainButton = wrapper.findByTestId('add_chain');
            expect(addChainButton.text()).toContain('Fantom Opera');
            expect(wrapper.findByTestId('switch_chain').exists()).toBe(false);
        });

        it.skip('should display "add chain" message if switching of the chain fails', async () => {
            wrapper = createWrapper(
                {
                    props: {
                        showSwitchChainButton: true,
                        chainId: '0xfa',
                    },
                },
                { errors: { switchChain: 'Unrecognized chain ID' } }
            );

            await wrapper.showWindow();
            await wrapper.findByTestId('switch_chain').trigger('click');

            expect(wrapper.text()).toContain(
                i18n.t('wallet.badChainWarningWindow.addChain.message', { chainName: 'Fantom Opera' })
            );
        });

        it.skip('should add chain if switching of the chain fails', async () => {
            wrapper = createWrapper(
                {
                    props: {
                        showSwitchChainButton: true,
                        chainId: '0xfa',
                    },
                },
                { errors: { switchChain: 'Unrecognized chain ID' } }
            );
            const addChainSpy = vi.spyOn(web3Wallet, 'addChain');

            await wrapper.showWindow();
            await wrapper.findByTestId('switch_chain').trigger('click');
            await wrapper.findByTestId('add_chain').trigger('click');

            expect(addChainSpy).toHaveBeenCalledWith('0xfa');
        });
    });
});
