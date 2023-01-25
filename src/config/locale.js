import { storeToRefs } from 'pinia';
import { useAppStore } from '@/modules/app/store.js';
import { clone, useFormatters } from 'fantom-vue3-components';
import { appConfig } from '@/config/app-config.js';
import { i18n } from '@/config/i18n.js';
import { translations } from 'fantom-vue3-components/src/mixins/translations.js';
import { useLocale } from 'fantom-vue3-components/src/composables/useLocale/useLocale.js';

export async function setupLocale() {
    const { lang, rtlDirection } = storeToRefs(useAppStore());
    const { locale } = useLocale();
    const { formatters } = useFormatters();

    locale.setup({
        locales: clone(appConfig.locales),
        languageRef: lang,
        rtlDirectionRef: rtlDirection,
        defaultLanguageCode: appConfig.defaultLanguageCode,
        i18n,
        translations,
        formatters,
    });

    await locale.setLocale();

    locale.setTextDirection();
}
