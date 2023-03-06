import { FANTOM_MAINNET, FANTOM_TESTNET } from './fantom-chain.js';

const mainConfig = {
    // app main title
    title: 'fUSD swap',
    // app description
    description: 'swap DAI for fUSD',
    // app keywords
    keywords: 'Fantom, fUDS, DAI, swap',
    // app code
    code: 'fusdswap',
    // default chain id
    chainId: FANTOM_MAINNET.chainId,
    useTestnet: true,
    useWebHashHistory: false,
    // apollo client settings
    apollo: {
        // Fantom api
        fantom: {
            // list of providers. if one of them is unavailable, another is randomly picked
            providers: [
                /*{
                    http: 'https://xapi-nodea.fantom.network/',
                    // for subscriptions
                    ws: '',
                },*/
                {
                    http: 'https://xapi-nodeb.fantom.network/',
                    // for subscriptions
                    ws: '',
                },
                {
                    http: 'https://xapi-nodec.fantom.network/',
                    // for subscriptions
                    ws: '',
                },
                {
                    http: 'https://xapi-noded.fantom.network/',
                    // for subscriptions
                    ws: '',
                },
                {
                    http: 'https://xapi-nodee.fantom.network/',
                    // for subscriptions
                    ws: '',
                },
                {
                    http: 'https://xapi-nodef.fantom.network/',
                    // for subscriptions
                    ws: '',
                },
            ],
            // index into providers array of default provider or 'random' - takes index randomly
            defaultProviderIndex: 'random',
        },
    },
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: 'fUSD swap',
        categories: ['finance'],
        mainColor: '#ffffff',
        description: 'swap DAI for fUSD',
        assetsVersion: '1',
    },
    locales: [{ tag: 'en', label: 'English' }],
    defaultLanguageCode: 'en',
    currencies: [{ value: 'USD', label: 'USD' }],
    defaultCurrency: 'USD',
    formats: {
        dateTime: {
            short: {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            },
            shortDatetime: {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric',
            },
        },
        number: {
            twoFractionDigits: {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        },
        ftmFractionDigits: 2,
    },
    fantomExplorer: {
        txUrl: `${FANTOM_MAINNET.explorer}/tx/`,
        addressUrl: `${FANTOM_MAINNET.explorer}/address/`,
    },
    themes: ['theme-default', 'theme-dark'],
    defaultTheme: 'theme-dark',
    oneAccountMode: true,
    // this object is set by calling `setEnv` function
    env: {
        mockingEnabled: false,
    },
};

const testnetConfig = {
    chainId: '0xfa2',
    apollo: {
        fantom: {
            providers: [
                {
                    http: 'https://xapi.testnet.fantom.network/api',
                    // for subscriptions
                    ws: '',
                },
            ],
        },
    },
    fantomExplorer: {
        txUrl: `${FANTOM_TESTNET.explorer}/tx/`,
        addressUrl: `${FANTOM_TESTNET.explorer}/address/`,
    },
};

export const appConfig = {
    ...mainConfig,
    ...(mainConfig.useTestnet ? testnetConfig : {}),
};

export function envToBool(value) {
    return value === 'true' || value === '1';
}

/**
 * Call this function in `main.js`
 */
export function setEnv() {
    appConfig.env.mockingEnabled = envToBool(import.meta.env.VITE_ENABLE_MOCKING);
}
