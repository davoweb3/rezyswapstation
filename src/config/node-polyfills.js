// dependecies: node-stdlib-browser, vite-plugin-node-stdlib-browser, @rollup/plugin-inject
import inject from '@rollup/plugin-inject';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

/**
 * @param {array} vitePlugins
 */
export function addNodePolyfills(vitePlugins) {
    vitePlugins.push({
        ...inject({
            global: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'global'],
            process: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'process'],
            Buffer: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'Buffer'],
        }),
        enforce: 'post',
        apply: 'build', // rollup plugin
    });

    vitePlugins.push(nodePolyfills());
}
