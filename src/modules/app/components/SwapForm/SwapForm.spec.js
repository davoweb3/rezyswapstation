import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import SwapForm from './SwapForm.vue';
import { DAI_TOKEN, FUSD_TOKEN } from '@/config/tokens.js';

let wrapper = null;

function DEFAULT_PROPS() {
    return {
        fromToken: { ...DAI_TOKEN(), balance: '0xDE0B6B3A7640000' }, // 1
        toToken: { ...FUSD_TOKEN(), balance: '0x4563918244F40000' }, // 5
    };
}

function createWrapper(
    options = {
        props: DEFAULT_PROPS(),
    }
) {
    return mount(SwapForm, { ...options, attachTo: document.body });
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('SwapForm', () => {
    it('should display right token symbols', () => {
        wrapper = createWrapper();

        const text = wrapper.text();
        expect(text).toContain(DAI_TOKEN().symbol);
        expect(text).toContain(FUSD_TOKEN().symbol);
    });

    it('should display given submit button label', () => {
        wrapper = createWrapper({
            props: {
                buttonLabel: 'button label',
                ...DEFAULT_PROPS(),
            },
        });

        expect(wrapper.findByTestId('swapform_submit_button').text()).toContain('button label');
    });

    describe('entering amount', () => {
        it('should enter the same amount to "toTokenAmount" input field if an amount is typed to "fromTokenAmount" input field', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('fromTokenAmount', 0.5);

            expect(wrapper.find('[name="toTokenAmount"]').element.value).toBe('0.5');
        });

        it('should not enter the same amount to "toTokenAmount" input field if an amount is typed to "fromTokenAmount" input field and the amount is bigger than max balance of "from" token', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('fromTokenAmount', 2);

            expect(wrapper.find('[name="toTokenAmount"]').element.value).toBe('');
        });

        it('should enter the same amount to "fromTokenAmount" input field if an amount is typed to "toTokenAmount" input field', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('toTokenAmount', 2);

            expect(wrapper.find('[name="fromTokenAmount"]').element.value).toBe('2');
        });
    });

    describe('form submit', () => {
        it('should emit `submit` event with from/to tokens and token amount', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('fromTokenAmount', 0.5);
            await wrapper.submitForm();

            expect(wrapper.emitted('submit')[0]).toEqual([
                {
                    fromToken: DAI_TOKEN(),
                    toToken: FUSD_TOKEN(),
                    tokenAmount: '0x6F05B59D3B20000'.toLowerCase(),
                },
            ]);
        });

        it('should not emit `submit` event if no amount was filled', async () => {
            wrapper = createWrapper();

            await wrapper.submitForm();

            expect(wrapper.emitted('submit')).toBeUndefined();
        });

        it('should not emit `submit` event if maximum balance is exceeded', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('fromTokenAmount', 2);
            await wrapper.submitForm();

            expect(wrapper.emitted('submit')).toBeUndefined();
        });
    });

    describe('"Connect Metamask" button', () => {
        it('should display "Connect Metamask" button if `displayMetamaskButton` property is set', () => {
            wrapper = createWrapper({
                props: {
                    displayMetamaskButton: true,
                    ...DEFAULT_PROPS(),
                },
            });

            expect(wrapper.findComponent({ name: 'WalletButtonC' }).exists()).toBe(true);
        });

        it('should not display "Connect Metamask" button by default', () => {
            wrapper = createWrapper();

            expect(wrapper.findComponent({ name: 'WalletButtonC' }).exists()).toBe(false);
        });
    });
});
