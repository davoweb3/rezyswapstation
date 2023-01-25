import { useGqlApi } from 'fantom-vue3-components';

const gqlApi = useGqlApi().gqlApi;

export function gasPriceData() {
    return {
        gasPrice: '0x24ab47394a',
    };
}

export function getGasPrice() {
    return gqlApi.queryMock({
        mockFunction: () => gasPriceData(),
    });
}
