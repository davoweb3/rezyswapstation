import { encodeFunctionData } from './encodeFunctionData/encodeFunctionData.js';
import { SWAP_CONTRACT } from '@/modules/app/constants/index.js';

export function approve(amount, tokenAddress) {
    return {
        to: tokenAddress,
        value: '0x0',
        data: encodeFunctionData(
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            [SWAP_CONTRACT, amount]
        ),
    };
}
