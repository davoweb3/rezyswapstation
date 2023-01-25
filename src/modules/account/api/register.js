import { useApi } from 'fantom-vue3-components';
import { getAccountBalance } from './queries/account-balance/account-balance.js';

const api = useApi().api;

api.registerQuery(getAccountBalance, 'getAccountBalance');

/**
 * @typedef {Object} AccountsApiQueries
 * @property {function(address: string)} getAccountBalance
 */
