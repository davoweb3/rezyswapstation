import { adjustToken, adjustTokens, tokenHasSymbol } from '@/utils/token/token.js';

describe('token utils', () => {
    const SYMBOLS_TO_ADJUST = ['wftm', 'fusd'];
    const LOGOS_TO_ADJUST = {
        wftm: 'wftm logo',
        fusd: 'fusd logo',
    };

    describe('tokenHasSymbol()', () => {
        it('should return `false` if token is not an object', () => {
            expect(tokenHasSymbol('foo', 'ftm')).toBe(false);
        });

        it('should return `false` if token has no "symbol" property', () => {
            expect(tokenHasSymbol({}, 'ftm')).toBe(false);
        });

        it('should return `true` if token has symbol property and no symbol is given', () => {
            expect(tokenHasSymbol({ symbol: 'FTM' })).toBe(true);
        });

        it('should return `true` if token has given symbol', () => {
            expect(tokenHasSymbol({ symbol: 'FTM' }, 'ftm')).toBe(true);
            expect(tokenHasSymbol({ symbol: 'wFTM' }, 'WFTM')).toBe(true);
        });
    });

    describe('adjustToken()', () => {
        function TOKEN() {
            return {
                symbol: 'WFTM',
            };
        }

        it('should adjust symbol of certain token', () => {
            const token = TOKEN();

            adjustToken(token, SYMBOLS_TO_ADJUST, LOGOS_TO_ADJUST);

            expect(token.symbol).toBe('wFTM');
        });

        it('should adjust logoURL of certain token', () => {
            const token = TOKEN();

            adjustToken(token, SYMBOLS_TO_ADJUST, LOGOS_TO_ADJUST);

            expect(token.logoURL).toBe('wftm logo');
        });
    });

    describe('adjustTokens()', () => {
        function TOKENS() {
            return [{ symbol: 'WFTM' }, { symbol: 'FUSD' }];
        }

        it('should adjust symbols and logos of certain tokens', () => {
            const tokens = TOKENS();

            adjustTokens(tokens, SYMBOLS_TO_ADJUST, LOGOS_TO_ADJUST);

            expect(tokens).toEqual([
                { symbol: 'wFTM', logoURL: 'wftm logo' },
                { symbol: 'fUSD', logoURL: 'fusd logo' },
            ]);
        });
    });
});
