<script setup>
import { FForm, FFormInput, FButton, objectEquals } from 'fantom-vue3-components';
import { TokenAmountField } from '@/common/components/index.js';
import { ref, watch } from 'vue';
import AppIconset from '@/common/components/AppIconset/AppIconset.vue';
import WalletButtonC from '@/modules/wallet/components/WalletButtonC/WalletButtonC.vue';

const emit = defineEmits(['submit']);

const props = defineProps({
    /** @type {{ symbol?: string, logo?: string, balance: string, decimals?: number }} */
    fromToken: {
        type: Object,
        default() {
            return {};
        },
        required: true,
    },
    /** @type {{ symbol?: string, logo?: string, balance: string, decimals?: number }} */
    toToken: {
        type: Object,
        default() {
            return {};
        },
        required: true,
    },
    buttonLabel: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    displayMetamaskButton: {
        type: Boolean,
        default: false,
    },
});

const fromValue = ref(0);
const toValue = ref(0);
const rFromToken = ref({});
const rToToken = ref({});
const fromTokenAmountField = ref(null);
// const balanceTokenProps = ref({ usePlaceholder: props.displayMetamaskButton });

function getValues(values) {
    return {
        tokenAmount: fromTokenAmountField.value.$refs.input.convertToTokenValue(values.fromTokenAmount),
        fromToken: {
            ...rFromToken.value,
            balance: undefined,
        },
        toToken: {
            ...rToToken.value,
            balance: undefined,
        },
    };
}

function onSubmit(event) {
    emit('submit', getValues(event.values));
}

function onFromTokenAmount(value) {
    toValue.value = value;
}

function onToTokenAmount(value) {
    fromValue.value = value;
}

watch(
    () => props.fromToken,
    (value, oldValue) => {
        if (!objectEquals(value, oldValue)) {
            rFromToken.value = value;
        }
    },
    { immediate: true }
);

watch(
    () => props.toToken,
    (value, oldValue) => {
        if (!objectEquals(value, oldValue)) {
            rToToken.value = value;
        }
    },
    { immediate: true }
);

/*
watch(
    () => props.displayMetamaskButton,
    (value) => {
        if (value) {
            // fromValue.value = 0;
            // toValue.value = 0;
            rFromToken.value.balance = '0x0';
            rToToken.value.balance = '0x0';
            // rFromToken.value = { ...rFromToken.value, balanceOf: '0x0' };
            // console.log(rFromToken.value);
        }
    },
    { immediate: true }
);
*/
</script>

<template>
    <FForm :disabled="disabled" class="swapform grid" @submit="onSubmit">
        <FFormInput
            ref="fromTokenAmountField"
            :type="TokenAmountField"
            :token="rFromToken"
            :model-value="fromValue"
            name="fromTokenAmount"
            :label="$t('app.swapForm.pay')"
            show-balance
            show-max-button
            show-token
            :balance-token-props="{ usePlaceholder: !displayMetamaskButton }"
            @update:value="onFromTokenAmount"
        />
        <div class="swapform_swapbutton">
            <AppIconset icon="arrowLeft" rotate="-90deg" size="20px" color="#888" />
        </div>
        <FFormInput
            :type="TokenAmountField"
            :token="rToToken"
            :model-value="toValue"
            name="toTokenAmount"
            :label="$t('app.swapForm.receive')"
            show-balance
            show-token
            no-max-validation
            :balance-token-props="{ usePlaceholder: !displayMetamaskButton }"
            @update:value="onToTokenAmount"
        />
        <slot name="above-buttons"></slot>
        <div class="fform_buttons">
            <FButton
                v-if="!displayMetamaskButton"
                type="submit"
                size="large"
                :label="buttonLabel || $t('app.swapForm.submit')"
                :loading="loading"
                :disabled="disabled"
                data-testid="swapform_submit_button"
            />
            <WalletButtonC v-else />
        </div>
    </FForm>
</template>

<style lang="scss">
.swapform {
    &_swapbutton {
        text-align: center;
    }
}
</style>
