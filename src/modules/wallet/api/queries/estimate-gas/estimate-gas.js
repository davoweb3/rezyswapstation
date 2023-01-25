import gql from 'graphql-tag';
import { useGqlApi } from 'fantom-vue3-components';

const gqlApi = useGqlApi().gqlApi;

/**
 * @param {string} from
 * @param {string} to
 * @param {string} value
 * @param {string} data
 * @return {{result: *, onError: *, data: ComputedRef<*|null>, fetchMore: *, dataPromise: Promise<*>, refetch: *, loading: *, error: *, onResult: *}}
 */
export function getEstimateGas({ from = undefined, to = undefined, value = undefined, data = undefined }) {
    return gqlApi.query({
        query: gql`
            query GetEstimateGas($from: Address, $to: Address, $value: BigInt, $data: String) {
                estimateGas(from: $from, to: $to, value: $value, data: $data)
            }
        `,
        variables: {
            from: from,
            to: to,
            value: value,
            data: data,
        },
    });
}
