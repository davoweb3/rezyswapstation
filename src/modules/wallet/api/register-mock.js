import { useApi } from 'fantom-vue3-components';
import { getGasPrice } from './queries/gas-price/mock/gas-price.js';
import { getEstimateGas } from './queries/estimate-gas/mock/estimate-gas.js';
import { getNonce } from './queries/nonce/mock/nonce.js';
import { getTransactionStatus } from './queries/transaction-status/mock/transaction-status.js';

const api = useApi().api;

api.registerQueryMock(getGasPrice, 'getGasPrice');
api.registerQueryMock(getEstimateGas, 'getEstimateGas');
api.registerQueryMock(getNonce, 'getNonce');
api.registerQueryMock(getTransactionStatus, 'getTransactionStatus');
