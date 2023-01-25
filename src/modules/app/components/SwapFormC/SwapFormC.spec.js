import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import SwapFormC from './SwapFormC.vue';
import { WalletMock } from '@/modules/wallet/test-helpers.js';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';
import { delay, useApi } from 'fantom-vue3-components';
import { erc20TokenBalanceData } from '@/modules/account/api/queries/account-balance/mock/account-balance.js';
import { i18n } from '@/config/i18n.js';

const api = useApi().api;
let wrapper = null;
let walletMock = null;

function createWrapper(
    options = {
        props: {
            address: TEST_ACCOUNT_ADDRESS,
            wallet: walletMock,
            checkContractFUSDBalance: false,
        },
    }
) {
    return mount(SwapFormC, { ...options, attachTo: document.body });
}

beforeAll(() => {
    api.fakeData('getErc20TokenBalance', () => {
        return erc20TokenBalanceData('0x4563918244F40000'); // 5
    });
});

afterAll(() => {
    api.restoreAllDataFakes();
});

beforeEach(() => {
    walletMock = new WalletMock();
});

afterEach(() => {
    destroyWrapper(wrapper);
    walletMock = null;
});

describe('SwapFormC', () => {
    it('should pass right tokens', () => {
        wrapper = createWrapper();

        const swapForm = wrapper.findComponent({ name: 'SwapForm' });
        expect(swapForm.vm.$props.fromToken.symbol.toLowerCase()).toBe('dai');
        expect(swapForm.vm.$props.toToken.symbol.toLowerCase()).toBe('fusd');
    });

    it('should disable form if balances are loading', async () => {
        wrapper = createWrapper();

        const swapForm = wrapper.findComponent({ name: 'SwapForm' });
        expect(swapForm.vm.$props.disabled).toBe(true);
    });

    it('should load token balances', async () => {
        wrapper = createWrapper();

        await delay();

        const tokenBalances = wrapper.findByTestCode('tokenamountfield_balance');
        expect(tokenBalances[0].text().toLowerCase()).toContain('5dai');
        expect(tokenBalances[1].text().toLowerCase()).toContain('5fusd');
    });

    it('should swap DAI for fUSD', async () => {
        wrapper = createWrapper();

        await delay();
        await wrapper.setFormElement('fromTokenAmount', 1);
        await wrapper.submitForm();

        const sendTransactionArgs = walletMock._sendTransactionArgs[0][0];
        expect(sendTransactionArgs.code).toBe('swap');
        expect(sendTransactionArgs.transaction.from).toBe(TEST_ACCOUNT_ADDRESS);
    });

    it('should approve DAI first if allowance is insufficient', async () => {
        wrapper = createWrapper();

        await delay();
        await wrapper.setFormElement('fromTokenAmount', 2);
        await wrapper.submitForm();

        const sendTransactionArgs = walletMock._sendTransactionArgs[0][0];
        expect(sendTransactionArgs.code).toBe('allow');
    });

    it('should display correct submit button label if swapping is in progress', async () => {
        wrapper = createWrapper();

        await delay();
        await wrapper.setFormElement('fromTokenAmount', 1);
        await wrapper.submitForm();

        expect(wrapper.findByTestId('swapform_submit_button').text()).toContain(i18n.t('app.swapForm.swapping'));
    });

    it('should display correct submit button label if DAI approving is in progress', async () => {
        wrapper = createWrapper();

        await delay();
        await wrapper.setFormElement('fromTokenAmount', 2);
        await wrapper.submitForm();

        expect(wrapper.findByTestId('swapform_submit_button').text()).toContain(i18n.t('app.swapForm.approving'));
    });

    describe('wallet is not connected', () => {
        it('should disable form', () => {
            wrapper = createWrapper({ props: { address: '', wallet: walletMock } });

            const swapForm = wrapper.findComponent({ name: 'SwapForm' });
            expect(swapForm.vm.$props.disabled).toBe(true);
        });

        it('should display metamask button', () => {
            wrapper = createWrapper({ props: { address: '', wallet: walletMock } });

            const swapForm = wrapper.findComponent({ name: 'SwapForm' });
            expect(swapForm.vm.$props.displayMetamaskButton).toBe(true);
        });
    });
});
