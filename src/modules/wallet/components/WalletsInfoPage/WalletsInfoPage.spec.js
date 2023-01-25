import { shallowMount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import { WalletsInfoPage, LogoutButtonC } from '@/modules/wallet/index.js';

let wrapper = null;

function createWrapper(options = {}) {
    return shallowMount(WalletsInfoPage, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('WalletsInfoPage', () => {
    it('should display "logout" button', () => {
        wrapper = createWrapper();
        const button = wrapper.findComponent(LogoutButtonC);

        expect(button.exists()).toBe(true);
    });
});
