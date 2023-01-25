<script setup>
import { FActionButtons } from 'fantom-vue3-components';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineEmits(['button-action']);

const buttons = ref([
    {
        action: 'logout',
        label: t('wallet.logout'),
        size: 'large',
    },
    {
        action: 'cancel',
        label: t('wallet.cancel'),
        size: 'large',
        secondary: true,
    },
]);
</script>

<template>
    <div class="logoutconfirmation grid">
        <p class="tea-center">
            {{ $t('wallet.logoutConfirmation.text') }}
        </p>
        <FActionButtons :buttons="buttons" @button-action="$emit('button-action', $event)" />
    </div>
</template>

<style lang="scss"></style>
