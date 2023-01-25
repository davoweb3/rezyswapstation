<script setup>
import { FWindow } from 'fantom-vue3-components';
import LogoutConfirmation from '@/modules/wallet/components/LogoutConfirmation/LogoutConfirmation.vue';
import { ref } from 'vue';
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';

const emit = defineEmits(['button-action']);

const window = ref(null);

/**
 * @param {'logout'|'cancel'} action
 */
function onButtonAction(action) {
    emit('button-action', action);
    window.value.hide();
}

defineExpose(exposeMethods(window, ['show', 'hide']));
</script>

<template>
    <FWindow ref="window" modal :title="$t('wallet.logout')" class="logoutconfirmationwindow fwindow-width-3">
        <LogoutConfirmation @button-action="onButtonAction" />
    </FWindow>
</template>
