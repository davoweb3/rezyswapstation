import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { appConfig } from '@/config/app-config.js';
import { FApolloClient } from '../../plugins/apollo/FApolloClient.js';
import { provide } from 'vue';
import { ApolloClients, provideApolloClients } from '@vue/apollo-composable';

export const fantomFApolloClient = new FApolloClient({
    apolloProviders: appConfig.apollo.fantom.providers,
    defaultProviderIndex: appConfig.apollo.fantom.defaultProviderIndex,
});

const fantomApolloClient = new ApolloClient({
    link: ApolloLink.from([
        fantomFApolloClient.getNetErrorLink(),
        fantomFApolloClient.getRetryLink(),
        fantomFApolloClient.getErrorLink(),
        fantomFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export const apolloClients = {
    default: fantomApolloClient,
};

export function setupApolloProviders() {
    provide(ApolloClients, apolloClients);
}

export function setupApolloProvidersOutsideSetup() {
    provideApolloClients(apolloClients);
}
