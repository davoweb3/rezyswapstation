import { getGasPrice } from './gas-price.js';
import { delay } from 'fantom-vue3-components';

describe('getGasPrice() mock', () => {
    it('should return expected outcome', async () => {
        const { data } = getGasPrice();

        await delay();

        expect(data.value).toBe('0x24ab47394a');
    });
});
