import { delay } from 'fantom-vue3-components';
import { getTokenAllowance } from './token-allowance.js';

describe('getTokenAllowance() mock', () => {
    it('should return expected outcome', async () => {
        const { data } = getTokenAllowance();

        await delay();

        expect(data.value.toLowerCase()).toBe('0xDE0B6B3A7640000'.toLowerCase());
    });
});
