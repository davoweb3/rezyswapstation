import { getTransactionStatus } from './transaction-status.js';
import { delay } from 'fantom-vue3-components';

describe('getTransactionStatus() mock', () => {
    it('should return expected outcome', async () => {
        const { dataPromise } = getTransactionStatus(
            '0x8d091280a01eb697315e1e4fd98c1dc9925befc07175eb0c4bbf20188ba9e27c'
        );

        await delay();

        expect(await dataPromise).toBe('0x1');
    });
});
