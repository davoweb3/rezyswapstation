import gql from 'graphql-tag';
import { useGqlApi } from 'fantom-vue3-components';

const gqlApi = useGqlApi().gqlApi;

/**
 * Transaction status: null - pending, 0x1 - success, 0x0 - fail
 *
 * @param {string} transactionHash
 * @return {{result: <any>, onError: (fn: (param: ApolloError) => void) => {off: () => void}, data: ComputedRef<*|null>, fetchMore: (options: (FetchMoreQueryOptions<null, any> & FetchMoreOptions<any, null>)) => (Promise<ApolloQueryResult<any>> | undefined), dataPromise: Promise<*>, refetch: (variables?: null) => (Promise<ApolloQueryResult<any>> | undefined), loading: <boolean>, error: <ApolloError | null>, onResult: (fn: (param: ApolloQueryResult<any>) => void) => {off: () => void}}}
 */
export function getTransactionStatus(transactionHash) {
    return gqlApi.query({
        query: gql`
            query GetTransactionStatus($hash: Bytes32!) {
                transaction(hash: $hash) {
                    status
                }
            }
        `,
        variables: {
            hash: transactionHash,
        },
        pickFn: getTransactionStatusPickFn,
    });
}

export function getTransactionStatusPickFn(data) {
    return data?.transaction?.status;
}
