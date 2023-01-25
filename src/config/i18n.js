import { VueI18n } from '@/plugins/VueI18n/VueI18n.js';
import { appConfig } from '@/config/app-config.js';
import { messageImports } from '@/config/locales/index.js';

export const i18n = new VueI18n(
    {
        locale: appConfig.defaultLanguageCode,
    },
    messageImports
);
