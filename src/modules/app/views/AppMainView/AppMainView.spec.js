import { shallowMount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AppMain from '@/modules/app/views/AppMainView/AppMainView.vue';

function createWrapper(options = { stubs: { AppHeader: true } }) {
    return shallowMount(AppMain, options);
}

let wrapper = null;

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('AppMain', () => {
    it('should display header', () => {
        wrapper = createWrapper();

        expect(wrapper.findComponent({ name: 'AppHeader' }).exists()).toBe(true);
    });
});
