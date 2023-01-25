import { encodeFunctionData } from './encodeFunctionData/encodeFunctionData.js';
import { SWAP_CONTRACT } from '@/modules/app/constants/index.js';

export function swapDAIForFUsd(amount) {
    return {
        to: SWAP_CONTRACT,
        value: '0x0',
        data: encodeFunctionData(
            {
                inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
                name: 'swap',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            [amount]
        ),
    };
}
