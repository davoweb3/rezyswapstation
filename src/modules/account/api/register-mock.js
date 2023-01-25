import { useApi } from 'fantom-vue3-components';
import { getAccountBalance } from './queries/account-balance/mock/account-balance.js';

const api = useApi().api;

api.registerQueryMock(getAccountBalance, 'getAccountBalance');
