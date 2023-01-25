<script setup>
import { FInput, FToken, FLabel, FButton, useFormatters } from 'fantom-vue3-components';
import { computed } from 'vue';
import Token from '@/common/components/Token/Token.vue';
import { ref } from 'vue';
import { bFromTokenValue, bFromWei, bToTokenValue, toHex } from '@/utils/big-number/big-number.js';
import { amountValidator } from '@/common/components/TokenAmountField/amount-validator/amountValidator.js';
import { useI18n } from 'vue-i18n';
import { tokenAmountFieldPropDefaults as defaults } from './prop-defaults.js';

const t = useI18n().t;
const { formatters } = useFormatters();

const emit = defineEmits(['validation-state', 'update:value']);

const props = defineProps({
    /** @type {{ symbol?: string, logo?: string, balance: string, decimals?: number }} */
    token: {
        type: Object,
        default() {
            return {};
        },
        required: true,
    },
    maxButtonLabel: {
        type: String,
        default: defaults.maxButtonLabel,
    },
    /** Emitted value is converted to hex in token decimals */
    convertOutput: {
        type: Boolean,
        default: defaults.convertOutput,
    },
    /** Show logo and symbol */
    showToken: {
        type: Boolean,
        default: defaults.showToken,
    },
    showBalance: {
        type: Boolean,
        default: defaults.showBalance,
    },
    showBalancePrice: {
        type: Boolean,
        default: defaults.showBalancePrice,
    },
    showMaxButton: {
        type: Boolean,
        default: defaults.showMaxButton,
    },
    disabled: {
        type: Boolean,
        default: defaults.disabled,
    },
    /** Don't validate max amount */
    noMaxValidation: {
        type: Boolean,
        default: defaults.noMaxValidation,
    },
    subtractFromMax: {
        type: Number,
        default: defaults.subtractFromMax,
    },
    inputTokenProps: {
        type: Object,
        default() {
            return defaults.inputTokenProps;
        },
    },
    balanceTokenProps: {
        type: Object,
        default() {
            return defaults.balanceTokenProps;
        },
    },
    tokenPrice: {
        type: Number,
        default: defaults.tokenPrice,
    },
    /** Size of input, 'large' | 'small' */
    fieldSize: {
        type: String,
        default: defaults.fieldSize,
    },
    /** Css class to be added to the root element */
    clas: {
        type: String,
        default: defaults.clas,
    },
});

const input = ref(null);

const logoSize = computed(() => {
    const { fieldSize } = props;
    let size = 20;

    if (fieldSize === 'large') {
        size = 28;
    } else if (fieldSize === 'small') {
        size = 16;
    }

    return size;
});

const buttonSize = computed(() => {
    const { fieldSize } = props;
    let size = 'small';

    if (fieldSize === 'small' || fieldSize === 'mini') {
        size = 'mini';
    }

    return size;
});

const balance = computed(() => getTokenBalance(props.token));
const balancePrice = computed(() => {
    return formatters.currency(bFromWei(props.token.balance).multipliedBy(props.tokenPrice).toNumber());
});

function validator(amount) {
    return amountValidator({
        amount,
        maxAmount: balance.value - props.subtractFromMax,
        maxAmountErrorMessage: !props.noMaxValidation ? t('common.tokenAmountField.maximumAmountReached') : '',
        invalidAmountErrorMessage: t('common.tokenAmountField.invalidAmount'),
    });
}

function getTokenDecimals(token) {
    return token.decimals || 18;
}

/**
 * @param {Object} token
 * @return {number}
 */
function getTokenBalance(token) {
    return bFromTokenValue(token.balance, getTokenDecimals(token)).toNumber();
}

function convertToTokenValue(value) {
    let val = value;

    // max
    if (Number(value) === balance.value) {
        val = props.token.balance;
    } else {
        val = toHex(bToTokenValue(value, getTokenDecimals(props.token)));
    }

    return val;
}

function onValueUpdate(value) {
    let val = value;

    if (validator(val) === '') {
        if (props.convertOutput) {
            val = convertToTokenValue(val);
        }

        emit('update:value', val);
    }
}

function onMaxButton() {
    input.value.setInputValue(balance.value - props.subtractFromMax);
    onValueUpdate(balance.value - props.subtractFromMax);
    input.value.validate();
    // validate();
}

defineExpose({
    convertToTokenValue,
    validate() {
        return input.value.validate();
    },
});
</script>

<template>
    <FInput
        ref="input"
        :clas="`tokenamountfield ${clas}`"
        type="number"
        min="0"
        validate-on-input
        :validator="validator"
        :field-size="fieldSize"
        :disabled="disabled"
        @validation-state="$emit('validation-state', $event)"
        @update:value="onValueUpdate"
    >
        <!-- copy slots -->
        <template v-for="(index, name) in $slots" v-slot:[name]="data">
            <slot :name="name" v-bind="data"> </slot>
        </template>

        <template #top="{ labeledById, label, required }">
            <span class="tokenamountfield_top">
                <FLabel native :id="labeledById" :required="required">{{ label }}</FLabel>
                <span v-if="showBalance">
                    <Token
                        :value="token.balance"
                        :decimals="getTokenDecimals(token)"
                        :symbol="token.symbol"
                        no-logo
                        v-bind="balanceTokenProps"
                        class="tokenamountfield_balance"
                        data-testcode="tokenamountfield_balance"
                    />
                    <span v-if="showBalancePrice" class="tokenamountfield_balanceprice"> ({{ balancePrice }}) </span>
                </span>
            </span>
        </template>

        <template #suffix>
            <FButton
                v-if="showMaxButton"
                :label="maxButtonLabel || $t('common.tokenAmountField.max')"
                :size="buttonSize"
                :disabled="disabled"
                secondary
                @click="onMaxButton"
            />
            <FToken
                v-if="showToken"
                class="ftoken-novalue"
                :symbol="token.symbol"
                :logo="token.logo"
                :logo-size="logoSize"
                v-bind="inputTokenProps"
            />
        </template>
    </FInput>
</template>

<style lang="scss">
@use '~fantom-vue3-components/src/assets/scss/tools';

.tokenamountfield {
    @include tools.no-input-arrows;

    &_top {
        display: flex;
        justify-content: space-between;
    }

    &_balance {
        font-size: var(--f-font-size-3);

        .token.ftoken .ftoken_value {
            font-weight: normal !important;
        }
    }

    &_balanceprice {
        font-size: var(--f-font-size-2);
        opacity: var(--f-opacity-7);
    }

    .flabel {
        display: inline-block;
    }

    .ftoken {
        --ftoken-logo-gap: var(--f-spacer-2);
    }
}
</style>
