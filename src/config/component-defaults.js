import { tokenAmountFieldPropDefaults as tokenAmountField } from '@/common/components/TokenAmountField/prop-defaults.js';

function setUpComponentDefaults() {
    tokenAmountField.fieldSize = 'large';
    tokenAmountField.clas = 'input-w100';
    tokenAmountField.balanceTokenProps = { usePlaceholder: true };
}

setUpComponentDefaults();
