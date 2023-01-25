import { useApi } from 'fantom-vue3-components';
import { sendTransaction } from './mutations/send-transaction/send-transaction.js';
import { getTokenAllowance } from './queries/token-allowance/token-allowance.js';

const api = useApi().api;

api.registerMutation(sendTransaction, 'sendTransaction');

api.registerQuery(getTokenAllowance, 'getTokenAllowance');

/**
 * @typedef {Object} CommonApiMutations
 * @property {function()} sendTransaction
 */

/**
 * @typedef {Object} CommonApiQueries
 * @property {function({ownerAddress: string, tokenAddress: string, disabled?: boolean}?)} getTokenAllowance
 */
