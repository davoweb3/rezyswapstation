import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TokenAmountField from './TokenAmountField.vue';
import { i18n } from '@/config/i18n.js';
import { FToken } from 'fantom-vue3-components';

let wrapper = null;
const TOKEN = {
    symbol: 'FTM',
    logo: 'logo.png',
    decimals: 18,
    balance: '0x6B14E9F9B0DF36A83', // 123456789123456789123
};

function createWrapper(options = {}) {
    return mount(TokenAmountField, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('TokenAmountField', () => {
    it('should display input field', () => {
        wrapper = createWrapper({
            props: {
                token: TOKEN,
            },
        });

        expect(wrapper.find('input[type="number"]').exists()).toBe(true);
    });

    it('should display given token', () => {
        wrapper = createWrapper({
            props: {
                showToken: true,
                token: TOKEN,
            },
        });

        expect(wrapper.text()).toContain(TOKEN.symbol);
        expect(wrapper.find('img').exists()).toBe(true);
    });

    it('should apply props to FToken component', () => {
        wrapper = createWrapper({
            props: {
                inputTokenProps: {
                    noLogo: true,
                },
                showToken: true,
                token: TOKEN,
            },
        });

        const fToken = wrapper.findComponent(FToken);
        expect(fToken.vm.$props.noLogo).toBe(true);
    });

    it('should display token balance', () => {
        wrapper = createWrapper({
            props: {
                showBalance: true,
                token: TOKEN,
            },
        });

        expect(wrapper.text()).toContain('123.46FTM');
    });

    it('should display token balance in USD', () => {
        wrapper = createWrapper({
            props: {
                showBalancePrice: true,
                tokenPrice: 0.1,
                showBalance: true,
                token: TOKEN,
            },
        });

        expect(wrapper.text()).toContain('$12.35');
    });

    it('should display "max" button for adding whole balance into the input field', () => {
        wrapper = createWrapper({
            props: {
                showMaxButton: true,
                maxButtonLabel: 'MAX',
                token: TOKEN,
            },
        });

        expect(wrapper.find('button').exists()).toBe(true);
        expect(wrapper.text()).toContain('MAX');
    });

    it('should input whole balance to the input field if "max" button is clicked', async () => {
        wrapper = createWrapper({
            props: {
                showMaxButton: true,
                token: TOKEN,
            },
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.find('input').element.value).toContain('123.456');
        expect(wrapper.emitted('update:value')).toBeTruthy();
    });

    it('should input whole balance minus "subtractFromMax" to the input field if "max" button is clicked', async () => {
        wrapper = createWrapper({
            props: {
                subtractFromMax: 1,
                showMaxButton: true,
                token: TOKEN,
            },
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.find('input').element.value).toContain('122.456');
    });

    it('should disable the "max" button if whole component is disabled', async () => {
        wrapper = createWrapper({
            props: {
                disabled: true,
                showMaxButton: true,
                token: TOKEN,
            },
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.find('input').element.value).toBe('');
        expect(wrapper.emitted('update:value')).toBeFalsy();
    });

    it('should emit "update:value" event with amount converted to hex in token decimals if `convertOutput` prop is set to true', async () => {
        wrapper = createWrapper({
            props: {
                convertOutput: true,
                token: TOKEN,
            },
        });

        await wrapper.find('input').setValue(1);

        expect(wrapper.emitted('update:value')[0][0].toLowerCase()).toBe('0xDE0B6B3A7640000'.toLowerCase());
    });

    it('should emit correct max amount (balance) converted to hex in token decimals if `convertOutput` prop is set to true and "max" button is clicked', async () => {
        wrapper = createWrapper({
            props: {
                convertOutput: true,
                showMaxButton: true,
                token: TOKEN,
            },
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('update:value')[0][0].toLowerCase()).toBe(TOKEN.balance.toLowerCase());
    });

    it('should validate amount on input', async () => {
        wrapper = createWrapper({
            props: {
                token: TOKEN,
            },
        });
        const input = wrapper.find('input');

        await input.setValue(500);

        expect(wrapper.emitted('validation-state')).toBeTruthy();
        expect(wrapper.text()).toContain(i18n.t('common.tokenAmountField.maximumAmountReached'));

        await input.setValue(-1);

        expect(wrapper.emitted('validation-state')).toBeTruthy();
        expect(wrapper.text()).toContain(i18n.t('common.tokenAmountField.invalidAmount'));
    });

    it('should not validate max amount if "noMaxValidation" is set to true', async () => {
        wrapper = createWrapper({
            props: {
                noMaxValidation: true,
                token: TOKEN,
            },
        });
        const input = wrapper.find('input');

        await input.setValue(500);

        expect(wrapper.emitted('validation-state')[0][0].valid).toBe(true);
    });

    it('should behave correctly when token is changed', async () => {
        wrapper = createWrapper({
            props: {
                convertOutput: true,
                showMaxButton: true,
                showToken: true,
                showBalance: true,
                token: TOKEN,
            },
        });

        await wrapper.setProps({
            token: {
                symbol: 'wFTM',
                balance: '0xDE0B6B3A7640000',
            },
        });
        await wrapper.find('button').trigger('click');

        expect(wrapper.text()).toContain('wFTM');
        expect(wrapper.text()).toContain('1wFTM');
        expect(wrapper.find('input').element.value).toContain('1');
        expect(wrapper.emitted('update:value')[0][0].toLowerCase()).toBe('0xDE0B6B3A7640000'.toLowerCase());
    });

    it('should expose `convertToTokenValue` method', () => {
        wrapper = createWrapper({ props: { token: TOKEN } });

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.convertToTokenValue).toBeDefined();
    });

    it('should expose `validate` method', () => {
        wrapper = createWrapper({ props: { token: TOKEN } });

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.validate).toBeDefined();
    });
});
