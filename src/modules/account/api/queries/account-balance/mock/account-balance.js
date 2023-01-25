import { useGqlApi } from 'fantom-vue3-components';
import { toHex } from '@/utils/big-number/big-number.js';
import {
    getErc20TokenBalancePickFn,
    getFTMBalancePickFn,
} from '@/modules/account/api/queries/account-balance/account-balance.js';
import { unref } from 'vue';

const gqlApi = useGqlApi().gqlApi;

// 123.456
export function ftmBalanceData(balance = '0x6B14BD1E6EEA00000') {
    return {
        account: {
            balance: toHex(balance),
            __typename: 'Account',
        },
    };
}

// 2
export function erc20TokenBalanceData(balance = '0x1BC16D674EC80000') {
    return {
        ercTokenBalance: toHex(balance),
    };
}

/**
 * @param {Ref|string} address
 * @param {Ref|string} erc20TokenAddress
 * @return {{result: null, onError: function(*): void, data: ComputedRef<*|null>, fetchMore: function(...[*]): void, dataPromise: Promise<*>, refetch: function(...[*]): void, loading: Ref<UnwrapRef<boolean>>, error: null, enabled: Ref<UnwrapRef<*>>, onResult: function(*): void}}
 */
export function getAccountBalance(address, erc20TokenAddress) {
    const tokenAddress = unref(erc20TokenAddress);

    return tokenAddress
        ? gqlApi.queryMock({
              mockFunction: () => erc20TokenBalanceData(),
              pickFn: getErc20TokenBalancePickFn,
              fnName: 'getErc20TokenBalance',
          })
        : gqlApi.queryMock({
              mockFunction: () => ftmBalanceData(),
              pickFn: getFTMBalancePickFn,
              fnName: 'getFTMBalance',
          });
}
