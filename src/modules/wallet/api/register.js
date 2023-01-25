import { useApi } from 'fantom-vue3-components';
import { getGasPrice } from './queries/gas-price/gas-price.js';
import { getEstimateGas } from './queries/estimate-gas/estimate-gas.js';
import { getNonce } from './queries/nonce/nonce.js';
import { getTransactionStatus } from './queries/transaction-status/transaction-status.js';

const api = useApi().api;

api.registerQuery(getGasPrice, 'getGasPrice');
api.registerQuery(getEstimateGas, 'getEstimateGas');
api.registerQuery(getNonce, 'getNonce');
api.registerQuery(getTransactionStatus, 'getTransactionStatus');

/**
 * @typedef {Object} WalletApiQueries
 * @property {function} getGasPrice
 * @property {function(from: string, to: string, value: string, data: string)} getEstimateGas
 * @property {function(address: string)} getNonce
 * @property {function(transactionHash: string)} getTransactionStatus
 */
