import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import LogoutConfirmation from './LogoutConfirmation.vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(LogoutConfirmation, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('LogoutConfirmation', () => {
    it('should re-emit "button-action" event', async () => {
        wrapper = createWrapper();

        await wrapper.findByTestId('action_button_logout').trigger('click');

        expect(wrapper.emitted('button-action')).toBeDefined();
    });
});
