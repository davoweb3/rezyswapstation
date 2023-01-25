import { Wallet } from '@/modules/wallet/Wallet/Wallet.js';
import { useWalletStore } from '@/modules/wallet/store.js';
import { onUnmounted } from 'vue';
import { appConfig } from '@/config/app-config.js';
import { useApi } from 'fantom-vue3-components';

let store = null;
let api = null;
const listeners = {};

function walletEventsListener(event) {
    for (let symbol of Object.getOwnPropertySymbols(listeners)) {
        listeners[symbol].forEach((listener) => {
            listener(event);
        });
    }
}

let wallet = null;

export function useWallet(outsideComponent = false) {
    const key = Symbol();

    if (!wallet) {
        store = useWalletStore();
        api = useApi().api;
        wallet = new Wallet({
            store,
            api,
            walletEventsListener,
            defaulChainId: appConfig.chainId,
            // disconnectOnRemove: appConfig.oneAccountMode,
        });
    }

    function onWalletEvents(fn) {
        if (typeof fn === 'function') {
            if (!listeners[key]) {
                listeners[key] = [];
            }

            listeners[key].push(fn);
        }
    }

    if (!outsideComponent) {
        onUnmounted(() => {
            if (listeners[key]) {
                delete listeners[key];
            }
        });
    }

    return {
        wallet,
        store,
        onWalletEvents,
    };
}
