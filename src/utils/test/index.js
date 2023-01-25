import { TestVueI18nUtils } from 'fantom-vue3-components/src/utils/test/vue-i18n/TestVueI18nUtils.js';
import { TestPiniaUtils } from 'fantom-vue3-components/src/utils/test/pinia/TestPiniaUtils.js';
import { i18n } from '@/config/i18n.js';
import { createTestingPinia } from '@pinia/testing';
import '@/config/api/register.js';
import '@/config/api/register-mocks.js';
import { setupAppIconset } from '@/config/app-iconset.js';
import en from '@/config/locales/en.js';

setupAppIconset();
i18n.setMessages({ en });

export const i18nT = new TestVueI18nUtils(i18n.i18n);
export const piniaT = new TestPiniaUtils(createTestingPinia);
