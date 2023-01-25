import { useGqlApi } from 'fantom-vue3-components';
import { getTransactionStatusPickFn } from '../transaction-status.js';

const gqlApi = useGqlApi().gqlApi;

export function transactionStatusData(status = '0x1') {
    return {
        transaction: {
            status,
            __typename: 'Transaction',
        },
    };
}

/*
export const transactionStatusQuery = graphql.query(TRANSACTION_STATUS_OPERATION_NAME, (req, res, ctx) => {
    const mockVars = req?.mockVars || {};

    return res(ctx.data(transactionStatusData(mockVars.status)));
});
*/

export function getTransactionStatus(hash, status) {
    return gqlApi.queryMock({
        mockFunction: () => transactionStatusData(status),
        pickFn: getTransactionStatusPickFn,
    });
}
