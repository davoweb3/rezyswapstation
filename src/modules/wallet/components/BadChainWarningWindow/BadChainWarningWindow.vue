<script setup>
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';
import { FWindow, FButton } from 'fantom-vue3-components';
import { getChainNameById } from '@/plugins/web3-wallets/utils/utils.js';
import { ref } from 'vue';
// import { useWallet } from '@/modules/wallet/index.js';

const props = defineProps({
    chainId: {
        type: [String, Number],
        default: '',
        required: true,
    },
    web3Wallet: {
        required: true,
    },
    showSwitchChainButton: {
        type: Boolean,
        default: false,
    },
});

// const wallet = useWallet(true).wallet;
const window = ref(null);
const chainAction = ref(false); // switch or add chain
const showAddChainButton = ref(false);

async function switchChain(chainId) {
    const web3Wallet = props.web3Wallet;

    if (typeof web3Wallet.switchChain === 'function') {
        try {
            await web3Wallet.switchChain(chainId);
        } catch (error) {
            chainAction.value = false;

            if (error.message.indexOf('Unrecognized chain ID') > -1) {
                showAddChainButton.value = true;
            }
        }
    }
}

async function addChain(chainId) {
    const web3Wallet = props.web3Wallet;

    if (typeof web3Wallet.addChain === 'function') {
        try {
            await web3Wallet.addChain(chainId);
        } catch (error) {
            chainAction.value = false;
        }
    }
}

async function onSwitchChainButtonClick() {
    if (!chainAction.value) {
        chainAction.value = true;

        await switchChain(props.chainId);

        chainAction.value = false;
    }
}

async function onAddChainButtonClick() {
    if (!chainAction.value) {
        chainAction.value = true;

        await addChain(props.chainId);

        chainAction.value = false;
    }
}

defineExpose(exposeMethods(window, ['show', 'hide', 'isWindowVisible']));
</script>

<template>
    <FWindow
        ref="window"
        modal
        :title="$t('wallet.notification')"
        class="badchainwarningwindow fwindow-width-3 fwindow-nobodytoppadding"
    >
        <p class="tea-center">
            <template v-if="!showAddChainButton">
                {{ $t('wallet.badChainWarningWindow.switchChain.message', { chainName: getChainNameById(chainId) }) }}
            </template>
            <template v-else>
                {{ $t('wallet.badChainWarningWindow.addChain.message', { chainName: getChainNameById(chainId) }) }}
            </template>
        </p>
        <div v-if="showSwitchChainButton" class="tea-center">
            <FButton
                v-if="!showAddChainButton"
                :label="
                    $t('wallet.badChainWarningWindow.switchChain.buttonLabel', { chainName: getChainNameById(chainId) })
                "
                size="large"
                data-testid="switch_chain"
                :loading="chainAction"
                :disabled="chainAction"
                @click="onSwitchChainButtonClick"
            />
            <FButton
                v-if="showAddChainButton"
                :label="
                    $t('wallet.badChainWarningWindow.addChain.buttonLabel', { chainName: getChainNameById(chainId) })
                "
                size="large"
                data-testid="add_chain"
                :loading="chainAction"
                :disabled="chainAction"
                @click="onAddChainButtonClick"
            />
        </div>
    </FWindow>
</template>
