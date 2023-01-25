import { useGqlApi } from 'fantom-vue3-components';
import { sendTransactionPickFn } from '../send-transaction.js';

const gqlApi = useGqlApi().gqlApi;

export function sendTransactionData(hash = '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795') {
    return {
        sendTransaction: {
            hash,
            __typename: 'Transaction',
        },
    };
}

export function sendTransaction() {
    return gqlApi.mutationMock({
        mockFunction: () => sendTransactionData(),
        pickFn: sendTransactionPickFn,
    });
}
