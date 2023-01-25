import gql from 'graphql-tag';
import { useGqlApi } from 'fantom-vue3-components';

const gqlApi = useGqlApi().gqlApi;

/**
 * @return {{result: <any>, onError: (fn: (param: ApolloError) => void) => {off: () => void}, data: ComputedRef<*|null>, fetchMore: (options: (FetchMoreQueryOptions<null, any> & FetchMoreOptions<any, null>)) => (Promise<ApolloQueryResult<any>> | undefined), dataPromise: Promise<*>, refetch: (variables?: null) => (Promise<ApolloQueryResult<any>> | undefined), loading: <boolean>, error: <ApolloError | null>, onResult: (fn: (param: ApolloQueryResult<any>) => void) => {off: () => void}}}
 */
export function getGasPrice() {
    return gqlApi.query({
        query: gql`
            query GetGasPrice {
                gasPrice
            }
        `,
    });
}
