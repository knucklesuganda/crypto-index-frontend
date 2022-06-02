import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";


export function bigNumberToString(value) {
    const decimalPlaces = Math.pow(10, 10);
    return Math.floor(parseFloat(formatEther(value)) * decimalPlaces) / decimalPlaces;
}


export function formatBigNumber(value, precision) {
    if (isNaN(precision)) {
        precision = 10;
    }

    const decimalPlaces = Math.pow(10, precision);
    return Math.floor(bigNumberToString(value) * decimalPlaces) / decimalPlaces;
}

export function formatNumber(value) {
    return value.toString().replace(/(?<!(\.\d*|^.{0}))(?=(\d{3})+(?!\d))/g, ',');
}

export function convertToBigNumber(value) {
    return BigNumber.from(parseEther(value.toString()));
}
