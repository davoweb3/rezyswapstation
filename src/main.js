import '@/config/component-defaults.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { i18n } from '@/config/i18n.js';
import App from './App.vue';
import { appConfig } from '@/config/app-config.js';
import { registerSW } from 'virtual:pwa-register';
import { useDocumentMeta } from 'fantom-vue3-components';
import { registerGlobalComponents } from '@/config/registerGlobalComponents.js';
import '@/config/api/register.js';
import { setupMocking } from '@/config/api/mocking.js';
import { setupApolloProvidersOutsideSetup } from '@/config/api/apollo-providers.js';
import { setupAppIconset } from '@/config/app-iconset.js';
import { setEnv } from '@/config/app-config.js';
import { setupLocale } from '@/config/locale.js';

setEnv();
setupApolloProvidersOutsideSetup();
setupAppIconset();

// PWA
registerSW({
    onOfflineReady() {},
});

const { documentMeta } = useDocumentMeta();
documentMeta.setMainTitle(appConfig.title);

async function startApp(app) {
    app.use(createPinia());
    app.use(i18n.i18n);

    registerGlobalComponents(app);

    await setupLocale();

    app.mount('#app');
}

setupMocking(() => {
    const app = createApp(App);
    startApp(app);
}, appConfig.env.mockingEnabled);
