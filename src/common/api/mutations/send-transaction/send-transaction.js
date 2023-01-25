import gql from 'graphql-tag';
import { useGqlApi } from 'fantom-vue3-components';

const gqlApi = useGqlApi().gqlApi;

/**
 * @return {{mutate: *, onError: *, called: *, onDone: *, loading: *, error: *}}
 */
export function sendTransaction(options = {}) {
    return gqlApi.mutation({
        mutation: gql`
            mutation ($transaction: Bytes!) {
                sendTransaction(tx: $transaction) {
                    hash
                    from
                    to
                }
            }
        `,
        pickFn: sendTransactionPickFn,
        options,
    });
}

export function sendTransactionPickFn(data) {
    return data?.sendTransaction?.hash;
}
