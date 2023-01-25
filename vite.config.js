/* eslint-disable no-undef */
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { appConfig, envToBool } from './src/config/app-config.js';
import { vitePluginTransformIndexHtml } from './src/plugins/vite-plugin-transform-index-html.js';
import { addNodePolyfills } from './src/config/node-polyfills.js';
import * as dotenv from 'dotenv';
import basicSsl from '@vitejs/plugin-basic-ssl';

dotenv.config();

const plugins = [vue()];
const testInclude = [];
const env = process.env;
const USE_HTTPS_DEV = envToBool(env.VITE_USE_HTTPS_DEV);

addNodePolyfills(plugins);

if (USE_HTTPS_DEV) {
    plugins.push(basicSsl());
}

// PWA
plugins.push(
    VitePWA({
        includeAssets: [
            'favicon-16x16.png',
            'favicon-32x32.png',
            'favicon.ico',
            'robots.txt',
            'apple-touch-icon.png',
            // 'fire2.gif',
        ],
        manifest: {
            name: appConfig.pwa.name,
            short_name: appConfig.pwa.name,
            theme_color: appConfig.pwa.mainColor,
            background_color: appConfig.pwa.mainColor,
            description: appConfig.pwa.description,
            categories: appConfig.pwa.categories,
            display: 'standalone',
            icons: [
                {
                    src: './pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: './pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        },
        registerType: 'autoUpdate',
    })
);

if (env.VITE_MODULE_TESTS) {
    testInclude.push(`src/modules/${env.VITE_TEST_MODULE}/**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`);
} else if (env.VITE_DIR_TESTS) {
    testInclude.push(`${env.VITE_TEST_DIR}/**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`);
} else if (!env.VITE_INTEGRATION_TESTS && !env.VITE_UNIT_TESTS) {
    testInclude.push('src/**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}');
} else if (env.VITE_INTEGRATION_TESTS) {
    testInclude.push('src/!**!/!*.integration.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}');
} else if (env.VITE_UNIT_TESTS) {
    testInclude.push('src/!**/!(*.integration).spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}');
}

plugins.push(
    vitePluginTransformIndexHtml({
        APP_TITLE: appConfig.title,
        APP_DESCRIPTION: appConfig.description,
        APP_KEYWORDS: appConfig.keywords,
    })
);

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        https: USE_HTTPS_DEV,
    },
    base: envToBool(env.VITE_SANDBOX_MODE) ? './' : undefined,
    plugins,
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '~fantom-vue3-components': 'fantom-vue3-components',
        },
    },
    test: {
        // include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
        include: testInclude,
        deps: {
            inline: ['fantom-vue3-components'],
        },
        setupFiles: [
            fileURLToPath(
                new URL('node_modules/fantom-vue3-components/src/plugins/vue-test-plugins/install.js', import.meta.url)
            ),
            fileURLToPath(new URL('src/plugins/vue-test-plugins/install.js', import.meta.url)),
            fileURLToPath(new URL('src/utils/test/install.js', import.meta.url)),
        ],
        globals: true,
        // minThreads: 2,
        // maxThreads: 3,
    },
    optimizeDeps: {
        exclude: ['fantom-vue3-components'],
    },
    define: {
        // global: true,
        // 'process.env': {},
    },
    /*esbuild: {
        keepNames: true,
    },*/
    /*build: {
        commonjsOptions: {
            // include: [/node_modules\/web3/],
        },
    },*/
    /*build: {
        rollupOptions: {
            plugins: [
                /!*NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }),*!/
                // Enable rollup polyfills plugin
                // used during production bundling
                nodePolyfills(),
            ],
        },
    },*/
});

/* eslint-enable no-undef */
