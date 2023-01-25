import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import LogoutButton from '@/modules/wallet/components/LogoutButton/LogoutButton.vue';
import { LogoutConfirmationWindow } from '@/modules/wallet/index.js';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(LogoutButton, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('LogoutButton', () => {
    it.todo('should match snapshot', () => {
        wrapper = createWrapper();

        expect(wrapper.element).toMatchSnapshot();
    });

    it('should show confirmation window on click', async () => {
        wrapper = createWrapper();

        await wrapper.find('button').trigger('click');

        const window = wrapper.findComponent(LogoutConfirmationWindow);
        expect(window.vm.$refs.window.isWindowVisible()).toBe(true);
    });

    it('should emit "logout" event if logout is confirmed', () => {
        wrapper = createWrapper();

        wrapper.findComponent(LogoutConfirmationWindow).vm.$emit('button-action', 'logout');

        expect(wrapper.emitted('logout')[0]).toBeDefined();
    });

    describe('without confirmation', () => {
        it('should not display confirmation window', async () => {
            wrapper = createWrapper({
                props: {
                    withoutConfirmation: true,
                },
            });

            await wrapper.find('button').trigger('click');

            const window = wrapper.findComponent(LogoutConfirmationWindow);
            expect(window.vm.$refs.window.isWindowVisible()).toBe(false);
        });

        it('should emit "logout" event on click', async () => {
            wrapper = createWrapper({
                props: {
                    withoutConfirmation: true,
                },
            });

            await wrapper.find('button').trigger('click');

            expect(wrapper.emitted('logout')[0]).toBeDefined();
        });
    });
});
