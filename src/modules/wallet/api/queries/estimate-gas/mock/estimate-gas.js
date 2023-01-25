import { useGqlApi } from 'fantom-vue3-components';

const gqlApi = useGqlApi().gqlApi;

export function estimateGasData() {
    return {
        estimateGas: '0x28301',
    };
}

export function getEstimateGas() {
    return gqlApi.queryMock({
        mockFunction: () => estimateGasData(),
    });
}
