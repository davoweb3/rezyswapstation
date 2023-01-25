<script setup>
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';
import { FWindow, FAddress } from 'fantom-vue3-components';
import { ref } from 'vue';

defineProps({
    address: {
        type: String,
        default: '',
        required: true,
    },
});

const window = ref(null);

defineExpose(exposeMethods(window, ['show', 'hide', 'isWindowVisible']));
</script>

<template>
    <FWindow
        ref="window"
        modal
        :title="$t('wallet.notification')"
        class="badaccountwarningwindow fwindow-width-3 fwindow-nobodytoppadding"
    >
        <p class="tea-center">
            {{ $t('wallet.badAccountWarningWindow.messagePart1') }}
            <FAddress :address="address" />
            {{ $t('wallet.badAccountWarningWindow.messagePart2') }}
        </p>
    </FWindow>
</template>
