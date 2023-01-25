import { sendTransaction } from './send-transaction.js';
import { delay } from 'fantom-vue3-components';

describe('sendTransaction() mock', () => {
    it('should return expected outcome', async () => {
        const { onDone, mutate } = sendTransaction();
        let result;
        onDone((res) => {
            result = res;
        });

        mutate();
        await delay();

        expect(result).toEqual('0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795');
    });
});
