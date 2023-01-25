<script setup>
import { LogoutButtonC } from '@/modules/wallet/index.js';

defineProps({
    oneAccountMode: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div class="walletsinfopage">
        <LogoutButtonC />
    </div>
</template>

<style lang="scss">
.walletsinfopage {
    --walletsinfopage-border-color: var(--f-color-grey-3);

    display: flex;
    flex-direction: column;

    > .fbutton {
        margin: 0;
        padding-inline-start: var(--f-spacer-4);
        padding-inline-end: var(--f-spacer-4);
        border-radius: 0;
        justify-content: start;
        border-top: 1px solid var(--walletsinfopage-border-color);
    }

    .accountlist {
        max-height: 330px;
        overflow: auto;
    }
}
</style>
