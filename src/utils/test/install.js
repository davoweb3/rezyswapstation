import { config } from '@vue/test-utils';
import { i18nT, piniaT } from '@/utils/test/index.js';
import { apolloClients, setupApolloProvidersOutsideSetup } from '@/config/api/apollo-providers.js';
import { ApolloClients } from '@vue/apollo-composable';
import 'fantom-vue3-components/src/test/mocks/matchMedia.js';
import 'fantom-vue3-components/src/test/mocks/IntersectionObserver.js';
import { registerGlobalComponents } from '@/config/registerGlobalComponents.js';

i18nT.addVueI18nPlugin(config);
piniaT.addPiniaPlugin(config);

config.global.provide[ApolloClients] = apolloClients;
registerGlobalComponents(config.global.components);

setupApolloProvidersOutsideSetup();
