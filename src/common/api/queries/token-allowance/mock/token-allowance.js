import { useGqlApi } from 'fantom-vue3-components';
import { toHex } from '@/utils/big-number/big-number.js';

const gqlApi = useGqlApi().gqlApi;

export function tokenAllowanceData(allowance = '0xDE0B6B3A7640000') {
    return {
        ercTokenAllowance: toHex(allowance),
    };
}

export function getTokenAllowance() {
    return gqlApi.queryMock({
        mockFunction: () => tokenAllowanceData(),
    });
}
