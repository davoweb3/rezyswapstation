import { toHex } from '@/utils/big-number/big-number.js';
import { useGqlApi } from 'fantom-vue3-components';
import { getNoncePickFn } from '../nonce.js';

const gqlApi = useGqlApi().gqlApi;

export function nonceData(txCount = 1) {
    return {
        account: {
            txCount: toHex(txCount),
            __typename: 'Account',
        },
    };
}

export function getNonce() {
    return gqlApi.queryMock({
        mockFunction: () => nonceData(),
        pickFn: getNoncePickFn,
    });
}
