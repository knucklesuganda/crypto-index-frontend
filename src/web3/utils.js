import { BigNumber } from "ethers";
import { parseEther, formatUnits } from "ethers/lib/utils";


export function bigNumberToNumber(value, valuePrecision) {
    valuePrecision = isNaN(valuePrecision) ? 18 : valuePrecision;

    console.log(valuePrecision, formatUnits(value, valuePrecision));
    const decimalPlaces = Math.pow(10, 10);

    return Math.floor(parseFloat(formatUnits(value, valuePrecision)) * decimalPlaces) / decimalPlaces;
}


export function roundNumber(value, precision) {
    if (isNaN(precision)) {
        precision = 10;
    }

    const decimalPlaces = Math.pow(10, precision);
    return Math.floor(value * decimalPlaces) / decimalPlaces;
}

export function formatNumber(value) {
    return value.toString().replace(/(?<!(\.\d*|^.{0}))(?=(\d{3})+(?!\d))/g, ',');
}

export function convertToEther(value) {
    return BigNumber.from(parseEther(value.toString()));
}

export { parseEther };
