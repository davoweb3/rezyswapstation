import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import WalletButtonC from '@/modules/wallet/components/WalletButtonC/WalletButtonC.vue';
import WalletButton from '@/modules/wallet/components/WalletButton/WalletButton.vue';
import WalletButtonPopover from '@/modules/wallet/components/WalletButtonPopover/WalletButtonPopover.vue';
import { nextTick } from 'vue';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';
import { i18n } from '@/config/i18n.js';

let wrapper = null;
let store = null;
const { wallet } = useWallet(true);

function createWrapper(options = {}) {
    const m = mount(WalletButtonC, options);

    store = wallet.store;

    return m;
}

afterEach(() => {
    destroyWrapper(wrapper);
    wallet.resetStore();
});

describe('WalletButtonC', () => {
    it('should set address from wallet store', async () => {
        wrapper = createWrapper();

        store.address = TEST_ACCOUNT_ADDRESS;
        await nextTick();

        expect(wrapper.findByTestId('wallet_address').text()).toBe(TEST_ACCOUNT_ADDRESS);
    });

    it('should set wallet name from wallet store', async () => {
        wrapper = createWrapper();

        store.address = TEST_ACCOUNT_ADDRESS;
        store.walletName = 'software';
        await nextTick();

        expect(wrapper.findByTestId('wallet_subtext').text()).toBe('software');
    });

    it('should display placeholder text if no address is given', async () => {
        wrapper = createWrapper();

        expect(wrapper.findByTestId('wallet_button').text()).toBe(i18n.t('wallet.walletButton.connectMetamask'));
    });

    it('should show WalletButtonPopover on click', async () => {
        wrapper = createWrapper();
        const popover = wrapper.findComponent(WalletButtonPopover);
        const button = wrapper.findComponent(WalletButton);
        store.address = TEST_ACCOUNT_ADDRESS;
        await nextTick();

        await button.trigger('click');

        expect(popover.vm.$refs.popover.isWindowVisible()).toBe(true);
    });

    it('should hide WalletButtonPopover on click if popover is visible', async () => {
        wrapper = createWrapper();
        const popover = wrapper.findComponent(WalletButtonPopover);
        const button = wrapper.findComponent(WalletButton);
        store.address = TEST_ACCOUNT_ADDRESS;
        await nextTick();

        await button.trigger('click');
        await button.trigger('click');

        expect(popover.vm.$refs.popover.isWindowVisible()).toBe(false);
    });

    it('should not show WalletButtonPopover on click if wallet is not set', async () => {
        wrapper = createWrapper();
        const popover = wrapper.findComponent(WalletButtonPopover);
        const button = wrapper.findComponent(WalletButton);

        await button.trigger('click');

        expect(popover.vm.$refs.popover.isWindowVisible()).toBe(false);
    });
});
