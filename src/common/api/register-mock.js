import { useApi } from 'fantom-vue3-components';
import { sendTransaction } from './mutations/send-transaction/mock/send-transaction.js';
import { getTokenAllowance } from './queries/token-allowance/mock/token-allowance.js';

const api = useApi().api;

api.registerMutationMock(sendTransaction, 'sendTransaction');

api.registerQueryMock(getTokenAllowance, 'getTokenAllowance');
