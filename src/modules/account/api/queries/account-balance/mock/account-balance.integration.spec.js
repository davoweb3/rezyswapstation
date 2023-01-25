import { delay } from 'fantom-vue3-components';
import { getAccountBalance } from './account-balance.js';

describe('getAccountBalance() mock', () => {
    it('should return expected outcome for ftm token', async () => {
        const { data } = getAccountBalance();

        await delay();

        expect(data.value.toLowerCase()).toBe('0x6B14BD1E6EEA00000'.toLowerCase());
    });

    it('should return expected outcome for erc20 token', async () => {
        const { data } = getAccountBalance('', '0x0');

        await delay();

        expect(data.value.toLowerCase()).toBe('0x1BC16D674EC80000'.toLowerCase());
    });
});
