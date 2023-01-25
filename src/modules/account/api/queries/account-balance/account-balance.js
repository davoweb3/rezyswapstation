import gql from 'graphql-tag';
import { useGqlApi } from 'fantom-vue3-components';
import { unref } from 'vue';

const gqlApi = useGqlApi().gqlApi;

export function getFTMBalancePickFn(data) {
    return data?.account?.balance;
}

export function getErc20TokenBalancePickFn(data) {
    return data?.ercTokenBalance;
}

/**
 * @param {Ref|string} address
 * @return {{result: *, onError: *, data: ComputedRef<*|null>, fetchMore: *, dataPromise: Promise<*>, refetch: *, loading: *, error: *, onResult: *}}
 */
function getFTMBalance(address) {
    return gqlApi.query({
        query: gql`
            query GetAccountBalance($address: Address!) {
                account(address: $address) {
                    balance
                }
            }
        `,
        variables: { address },
        pickFn: getFTMBalancePickFn,
        disabled: !unref(address),
    });
}

/**
 * @param {Ref|string} address
 * @param {Ref|string} tokenAddress
 * @return {{result: *, onError: *, data: ComputedRef<*|null>, fetchMore: *, dataPromise: Promise<*>, refetch: *, loading: *, error: *, onResult: *}}
 */
function getErc20TokenBalance(address, tokenAddress) {
    return gqlApi.query({
        query: gql`
            query GetErc20TokenBalance($owner: Address!, $token: Address!) {
                ercTokenBalance(owner: $owner, token: $token)
            }
        `,
        variables: { owner: address, token: tokenAddress },
        pickFn: getErc20TokenBalancePickFn,
        disabled: !unref(address) || !unref(tokenAddress),
    });
}

/**
 * @param {Ref|string} address
 * @param {Ref|string} [erc20TokenAddress]
 * @return {{result: *, onError: *, data: ComputedRef<*|null>, fetchMore: *, dataPromise: Promise<*>, refetch: *, loading: *, error: *, onResult: *}}
 */
export function getAccountBalance(address, erc20TokenAddress = '') {
    return unref(erc20TokenAddress) ? getErc20TokenBalance(address, erc20TokenAddress) : getFTMBalance(address);
}
