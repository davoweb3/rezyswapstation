<script setup>
import AppHeader from '@/modules/app/components/AppHeader/AppHeader.vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store.js';
import { ref, watch } from 'vue';
import { reloadAppMainViewSwitcher } from '@/modules/app/helpers.js';
import { FCard, getUniqueId } from 'fantom-vue3-components';
import SwapFormC from '@/modules/app/components/SwapFormC/SwapFormC.vue';

const { address: accountAddress } = storeToRefs(useWalletStore());
const key = ref(getUniqueId());

watch(accountAddress, () => {
    reloadAppMainViewSwitcher();
});

function onSwapFinished() {
    console.log('onSwapFinished');
    key.value = getUniqueId();
}
</script>

<template>
    <div class="appmainview main">
        <AppHeader />
        <main>
            <h1>Swap DAI for fUSD</h1>
            <p class="tea-center">
                We created this tool to swap DAI and receive fUSD in 1:1 ratio. <br />
                You can then use fUSD to pay back your debt.
            </p>
            <FCard class="appmainview_swapform">
                <SwapFormC @swap-finished="onSwapFinished" :key="key" />
            </FCard>
        </main>
    </div>
</template>

<style lang="scss">
.appmainview {
    main {
        max-width: 940px;
        margin: 0 auto;
        padding: var(--f-spacer-7) var(--f-spacer-4);

        h1 {
            margin-top: 0;
            text-align: center;
        }
    }

    &_swapform {
        max-width: 480px;
        margin: var(--f-spacer-7) auto 0 auto;
    }
}
</style>
