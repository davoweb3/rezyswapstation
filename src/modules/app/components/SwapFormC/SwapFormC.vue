<script setup>
import SwapForm from '@/modules/app/components/SwapForm/SwapForm.vue';
import { DAI_TOKEN, FUSD_TOKEN } from '@/config/tokens.js';
import { useWallet } from '@/modules/wallet/index.js';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store.js';
import { useApi, FMessage } from 'fantom-vue3-components';
import { swapDAIForFUsd } from '@/utils/tx/swap.js';
import { toBigNumber } from '@/utils/big-number/big-number.js';
import { approve } from '@/utils/tx/allowance.js';
import { SWAP_CONTRACT } from '@/modules/app/constants/index.js';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['swap-finished']);

const props = defineProps({
    address: {
        type: String,
        default: '',
    },
    wallet: {
        default: null,
    },
    checkContractFUSDBalance: {
        type: Boolean,
        default: true,
    },
});

const api = useApi().api;
const t = useI18n().t;
const DAI = DAI_TOKEN();
const FUSD = FUSD_TOKEN();
let swapArgs = null;
const wallet = props.wallet || useWallet().wallet;
const txStatus = ref({});
const buttonLabel = ref('');
const notEnoughFUSD = ref(false);
const loading = ref(false);
const { address: accountAddress } = storeToRefs(useWalletStore());
const cAddress = computed(() => props.address || accountAddress.value);

const cDisplayMetamaskButton = computed(() => !cAddress.value);

const {
    data: daiBalance,
    loading: daiBalanceLoading,
    enabled: daiBalanceEnabled,
} = api.query.getAccountBalance(cAddress, DAI.address);

const {
    data: fusdBalance,
    loading: fusdBalanceLoading,
    enabled: fusdBalanceEnabled,
} = api.query.getAccountBalance(cAddress, FUSD.address);

const { data: daiTokenAllowance, enabled: daiTokenAllowanceEnabled } = api.query.getTokenAllowance({
    ownerAddress: cAddress,
    tokenAddress: DAI.address,
    spenderAddress: SWAP_CONTRACT,
});

const cDisabled = computed(
    () =>
        !cAddress.value ||
        daiBalanceLoading.value ||
        fusdBalanceLoading.value ||
        txStatus.value.status === 'pending' ||
        loading.value
);
const cDaiBalance = computed(() => {
    let balance = daiBalance.value || '0x0';

    if (daiBalanceLoading.value) {
        balance = '';
    } else if (!cAddress.value) {
        balance = '0x0';
    }

    return balance;
});
const cFUsdBalance = computed(() => {
    let balance = fusdBalance.value || '0x0';

    if (fusdBalanceLoading.value) {
        balance = '';
    } else if (!cAddress.value) {
        balance = '0x0';
    }

    return balance;
});

daiBalanceEnabled.value = !!cAddress.value;
fusdBalanceEnabled.value = !!cAddress.value;
daiTokenAllowanceEnabled.value = !!cAddress.value;

watch(cAddress, (address) => {
    daiBalanceEnabled.value = !!address;
    fusdBalanceEnabled.value = !!address;
    daiTokenAllowanceEnabled.value = !!address;
});

async function allow({ amount, tokenAddress, address }) {
    buttonLabel.value = t('app.swapForm.approving');

    await wallet.sendTransaction({
        transaction: {
            ...approve(amount, tokenAddress),
            from: address,
        },
        code: 'allow',
        txStatus,
    });
}

async function swap({ amount, address }) {
    buttonLabel.value = t('app.swapForm.swapping');

    await wallet.sendTransaction({
        transaction: {
            ...swapDAIForFUsd(amount),
            from: address,
        },
        code: 'swap',
        txStatus,
    });
}

async function getContractFUSDBalance() {
    return api.query.getAccountBalance(SWAP_CONTRACT, FUSD.address).dataPromise;
}

async function onSubmit(values) {
    const amount = values.tokenAmount;

    loading.value = true;

    if (props.checkContractFUSDBalance && toBigNumber(await getContractFUSDBalance()).isLessThan(amount)) {
        notEnoughFUSD.value = true;
    } else {
        notEnoughFUSD.value = false;

        if (toBigNumber(daiTokenAllowance.value).isLessThan(amount)) {
            swapArgs = {
                amount,
                address: cAddress.value,
            };

            await allow({
                amount,
                tokenAddress: DAI.address,
                address: cAddress.value,
            });
        } else {
            swap({
                amount,
                address: cAddress.value,
            });
        }
    }

    loading.value = false;
}

watch(txStatus, (ts) => {
    if (ts.status === 'rejected' || ts.status === 'error') {
        buttonLabel.value = '';
    }

    if (ts.code === 'allow' && ts.status === 'success') {
        swap(swapArgs);
        swapArgs = null;
    } else if (ts.code === 'swap' && ts.status === 'success') {
        buttonLabel.value = '';
        emit('swap-finished');
    }
});
</script>

<template>
    <SwapForm
        :from-token="{ ...DAI, balance: cDaiBalance }"
        :to-token="{ ...FUSD, balance: cFUsdBalance }"
        :disabled="cDisabled"
        :loading="txStatus.status === 'pending' || loading"
        :display-metamask-button="cDisplayMetamaskButton"
        :button-label="buttonLabel"
        class="swapformc"
        @submit="onSubmit"
    >
        <template #above-buttons>
            <FMessage v-if="notEnoughFUSD" type="error" with-icon>{{ $t('app.swapForm.notEnoughFUSD') }}</FMessage>
        </template>
    </SwapForm>
</template>

<style lang="scss">
.swapformc {
    .fmessage {
        width: 100%;
        justify-content: center;

        &_body {
            width: initial;
        }
    }
}
</style>
