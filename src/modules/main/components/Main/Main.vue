<script setup>
import { setupApolloProviders } from '@/config/api/apollo-providers.js';
import { FNotifications, FTooltip, FNetworkStatus } from 'fantom-vue3-components';
import AppTheme from '@/modules/app/components/AppTheme/AppTheme.vue';
import { appConfig } from '@/config/app-config.js';
import { setupFormatters } from '@/config/formatters.js';
import '@/config/api/register.js';
import { setupGqlApi } from '@/config/api/gql-api.js';
import { useAccounts } from '@/modules/account/index.js';
import { setupWallets } from '@/config/web3-wallets.js';
import WalletEventsHandler from '@/modules/wallet/components/WalletEventsHandler/WalletEventsHandler.vue';
import { useNotifications } from 'fantom-vue3-components/src/composables/useNotifications/useNotifications.js';
import AppMainView from '@/modules/app/views/AppMainView/AppMainView.vue';

setupFormatters();
setupWallets();
setupApolloProviders();
useAccounts();

setupGqlApi();

const notifications = useNotifications().notifications;
/*
onMounted(() => {
    setupGqlApi();
});
*/
</script>

<template>
    <AppMainView />

    <AppTheme :themes="appConfig.themes" :default-theme="appConfig.defaultTheme" />
    <FNotifications
        strategy="newest-first"
        with-icon
        position="top-center"
        hide-on-click
        animation-in="scale-center-enter-active"
        animation-out="scale-center-leave-active"
    />
    <FTooltip with-arrow hide-on-document-scroll />
    <WalletEventsHandler :notifications="notifications" />
    <FNetworkStatus />
</template>
