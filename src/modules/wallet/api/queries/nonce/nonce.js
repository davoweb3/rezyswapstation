import gql from 'graphql-tag';
import { useGqlApi } from 'fantom-vue3-components';

const gqlApi = useGqlApi().gqlApi;

/**
 *
 * @param {string} address
 * @return {{result: *, onError: *, data: ComputedRef<*|null>, fetchMore: *, dataPromise: Promise<*>, refetch: *, loading: *, error: *, onResult: *}}
 */
export function getNonce(address) {
    return gqlApi.query({
        query: gql`
            query GetNonce($address: Address!) {
                account(address: $address) {
                    txCount
                }
            }
        `,
        variables: {
            address,
        },
        pickFn: getNoncePickFn,
    });
}

export function getNoncePickFn(data) {
    return data?.account?.txCount;
}
