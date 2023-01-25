import { getNonce } from './nonce.js';
import { delay } from 'fantom-vue3-components';

describe('getNonce() mock', () => {
    it('should return expected outcome', async () => {
        const { data } = getNonce();

        await delay();

        expect(data.value).toEqual('0x1');
    });
});
