import { useFormatters } from 'fantom-vue3-components';
import { appConfig } from '@/config/app-config.js';

export function setupFormatters(defaultCurrency = appConfig.defaultCurrency) {
    const { formatters } = useFormatters();

    formatters.setup({
        dateTimeFormats: appConfig.formats.dateTime,
        numberFormats: appConfig.formats.number,
        defaultCurrency,
    });
}
