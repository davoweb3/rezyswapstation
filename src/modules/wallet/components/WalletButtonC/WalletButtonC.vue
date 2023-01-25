<script setup>
import WalletButton from '@/modules/wallet/components/WalletButton/WalletButton.vue';
import { useI18n } from 'vue-i18n';
import WalletButtonPopover from '@/modules/wallet/components/WalletButtonPopover/WalletButtonPopover.vue';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store.js';
import { useAccounts } from '@/modules/account/index.js';
import AddingExistingAccountWarningWindow from '@/modules/wallet/components/AddingExistingAccountWarningWindow/AddingExistingAccountWarningWindow.vue';

const accounts = useAccounts().accounts;
const { address, walletName } = storeToRefs(useWalletStore());
const { t } = useI18n();
const popover = ref(null);
const addingExistingAccountWarningWindow = ref(null);

async function addWeb3Wallet(walletName) {
    const previousActiveAccountAddress = accounts.store.activeAccountAddress;

    await accounts.setActiveAccount({ walletName });

    if (walletName === 'metamask' && previousActiveAccountAddress === accounts.store.activeAccountAddress) {
        const account = accounts.getAccountByAddress(accounts.store.activeAccountAddress);

        if (account?.walletName === 'metamask') {
            address.value = previousActiveAccountAddress;
            addingExistingAccountWarningWindow.value.show();
        }
    }
}

function onClick() {
    if (address.value !== '') {
        popover.value.toggle();
    } else {
        addWeb3Wallet('metamask');
    }
}
</script>

<template>
    <WalletButton
        :address="address"
        :sub-text="walletName"
        :placeholder-text="t('wallet.walletButton.connectMetamask')"
        id="wbtn"
        @click="onClick"
    />
    <WalletButtonPopover attach-to="#wbtn" ref="popover">
        <slot name="popover"></slot>
    </WalletButtonPopover>
    <AddingExistingAccountWarningWindow ref="addingExistingAccountWarningWindow" :address="address" />
</template>

<style lang="scss"></style>
