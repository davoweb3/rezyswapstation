import { useMutation, useQuery } from '@vue/apollo-composable';
import { useNotifications } from 'fantom-vue3-components/src/composables/useNotifications/useNotifications.js';
import { useGqlApi, GqlPagination } from 'fantom-vue3-components';

export function setupGqlApi() {
    const { notifications } = useNotifications();
    const gqlApi = useGqlApi().gqlApi;

    GqlPagination.setPageInfoAttrNames('fantom-api', {
        startCursor: 'first',
        endCursor: 'last',
        hasNextPage: 'hasNext',
        hasPreviousPage: 'hasPrevious',
    });
    GqlPagination.setQueryVariableNames('fantom-api', {
        first: 'count',
        last: 'last',
        after: 'cursor',
        before: 'before',
    });

    gqlApi.setup({
        useQuery,
        useMutation,
        onError: (error) => {
            notifications.add({
                type: 'error',
                text: error.message,
            });
        },
    });
}
