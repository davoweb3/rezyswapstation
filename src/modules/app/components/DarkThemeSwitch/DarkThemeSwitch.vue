<script setup>
import { FDarkThemeSwitch } from 'fantom-vue3-components';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/modules/app/store.js';

const { theme } = storeToRefs(useAppStore());

function onChange(event) {
    if (event.target.checked) {
        theme.value = 'theme-dark';
    } else {
        theme.value = 'theme-default';
    }
}
</script>

<template>
    <FDarkThemeSwitch
        :model-value="theme === 'theme-dark'"
        @change="onChange"
        :title="$t('app.darkThemeSwitch.label')"
        class="darkthemeswitch"
    />
</template>

<style lang="scss">
.fdarkthemeswitch {
    .togglebtn {
        --f-togglebtn-background: var(--f-color-primary-4);
        //--f-togglebtn-background: transparent;
        //--f-togglebtn-border: 1px solid var(--f-color-grey-3);
        --f-togglebtn-border: 1px solid transparent;
        --f-togglebtn-theme-color: var(--theme-dark-color-5);
    }
}
</style>
