import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import BadAccountWarningWindow from './BadAccountWarningWindow.vue';
import { i18n } from '@/config/i18n.js';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(BadAccountWarningWindow, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('BadAccountWarningWindow', () => {
    it('should expose FWindow methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.isWindowVisible).toBeDefined();
    });

    it('should display correct text', async () => {
        wrapper = createWrapper({
            props: {
                address: TEST_ACCOUNT_ADDRESS,
            },
        });

        await wrapper.showWindow();

        expect(wrapper.text()).toContain(
            `${i18n.t('wallet.badAccountWarningWindow.messagePart1')} ${TEST_ACCOUNT_ADDRESS} ${i18n.t(
                'wallet.badAccountWarningWindow.messagePart2'
            )}`
        );
    });
});
