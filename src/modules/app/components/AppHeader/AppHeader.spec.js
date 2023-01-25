import { shallowMount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AppHeader from '@/modules/app/components/AppHeader/AppHeader.vue';

function createWrapper(options = {}) {
    return shallowMount(AppHeader, options);
}

let wrapper = null;

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('AppHeader', () => {
    it('should display logo', () => {
        wrapper = createWrapper();

        expect(wrapper.findByTestId('logo').exists()).toBe(true);
    });

    it('should show social media links', () => {
        wrapper = createWrapper();

        expect(wrapper.findComponent({ name: 'SocialMediaLinks' }).exists()).toBe(true);
    });

    it('should display wallet button', () => {
        wrapper = createWrapper();

        const languageSelect = wrapper.findComponent({ name: 'WalletButtonC' });

        expect(languageSelect.exists()).toBe(true);
    });
});
