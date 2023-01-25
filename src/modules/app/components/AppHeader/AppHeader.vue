<script setup>
import WalletButtonC from '@/modules/wallet/components/WalletButtonC/WalletButtonC.vue';
import SocialMediaLinks from '@/modules/app/components/SocialMediaLinks/SocialMediaLinks.vue';
import DarkThemeSwitch from '@/modules/app/components/DarkThemeSwitch/DarkThemeSwitch.vue';
</script>

<template>
    <header class="appheader">
        <div class="appheader_left">
            <div class="appheader_logo">
                <a href="https://fantom.foundation/" target="_blank" rel="nofollow" title="Fantom Foundation">
                    <img src="/fantom-logo.svg" alt="Fantom logo" data-testid="logo" />
                </a>
            </div>
            <!--            <div class="appheader_separator">&nbsp;</div>-->
            <SocialMediaLinks />
        </div>
        <div class="appheader_right">
            <DarkThemeSwitch />
            <WalletButtonC />
        </div>
    </header>
</template>

<style lang="scss">
@use 'fantom-vue3-components/src/assets/scss/tools/media';
@use 'fantom-vue3-components/src/assets/scss/settings/breakpoints';

.appheader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--f-color-primary-5);
    padding: var(--f-spacer-2) var(--f-spacer-2) var(--f-spacer-2) var(--f-spacer-3);
    //padding: 0 var(--f-spacer-3) 0 var(--f-spacer-3);
    gap: var(--f-spacer-5);

    &_left {
        display: flex;
        align-items: center;
    }

    &_separator {
        width: 1px;
        background: var(--f-color-primary-4);
        margin-left: var(--f-spacer-5);
    }

    &_logo {
        img {
            display: block;
            max-height: var(--f-spacer-6);
        }
    }

    .socialmedialinks {
        margin-left: var(--f-spacer-3);
    }

    .fdarkthemeswitch {
        opacity: 0.85;
    }
}

:root.theme-dark {
    .appheader {
        background: var(--theme-dark-color-6);

        &_separator {
            background: var(--f-color-grey-1);
            opacity: 0.2;
        }
    }
}

@include media.media-max(40em) {
    .appheader {
        flex-direction: column;
        gap: var(--f-spacer-3);
        padding-top: var(--f-spacer-3);
        padding-bottom: var(--f-spacer-3);

        &_left {
            justify-content: space-between;
        }
    }
}
</style>
