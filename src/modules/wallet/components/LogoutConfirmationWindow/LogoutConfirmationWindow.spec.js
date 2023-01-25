import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import LogoutConfirmationWindow from '@/modules/wallet/components/LogoutConfirmationWindow/LogoutConfirmationWindow.vue';
import { LogoutConfirmation } from '@/modules/wallet/index.js';
import { nextTick } from 'vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(LogoutConfirmationWindow, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('LogoutConfirmationWindow', () => {
    it('should display LogoutConfirmation component', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();

        expect(wrapper.findComponent(LogoutConfirmation).exists()).toBe(true);
    });

    it('should hide window on an action button click', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.findByTestId('action_button_cancel').trigger('click');
        await nextTick();

        expect(wrapper.vm.$refs.window.isWindowVisible()).toBe(false);
    });

    it('should re-emit "button-action" event', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.findByTestId('action_button_logout').trigger('click');
        await nextTick();

        expect(wrapper.emitted('button-action')[0]).toEqual(['logout']);
    });

    it('should expose FWindow methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
    });
});
