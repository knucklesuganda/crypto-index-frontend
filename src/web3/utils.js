import { BigNumber } from "ethers";
import { parseEther, formatUnits } from "ethers/lib/utils";


export function bigNumberToNumber(value, valuePrecision) {
    valuePrecision = isNaN(valuePrecision) ? 18 : valuePrecision;
    const decimalPlaces = Math.pow(10, 10);
    return Math.floor(parseFloat(formatUnits(value, valuePrecision)) * decimalPlaces) / decimalPlaces;
}


export function roundNumber(value, precision) {
    if (isNaN(precision)) {
        precision = 10;
    }

    const decimalPlaces = Math.pow(10, precision);

    if(value instanceof BigNumber){
        value = bigNumberToNumber(value);
    }

    return Math.floor(value * decimalPlaces) / decimalPlaces;
}

export function formatNumber(value) {
    return value.toString().replace(' ', '').replace(/(?<!(\.\d*|^.{0}))(?=(\d{3})+(?!\d))/g, ',');
}

export function convertToEther(value) {
    return BigNumber.from(parseEther(value.toString()));
}

export { parseEther };
