import gql from 'graphql-tag';
import { useGqlApi } from 'fantom-vue3-components';

const gqlApi = useGqlApi().gqlApi;

export function getTokenAllowance({ ownerAddress, tokenAddress, spenderAddress, disabled = false }) {
    return gqlApi.query({
        query: gql`
            query GetTokenAllowance($owner: Address!, $token: Address!, $spender: Address!) {
                ercTokenAllowance(token: $token, owner: $owner, spender: $spender)
            }
        `,
        variables: {
            owner: ownerAddress,
            token: tokenAddress,
            spender: spenderAddress,
        },
        disabled,
    });
}
