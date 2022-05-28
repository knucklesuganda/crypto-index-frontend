import { formatEther } from "ethers/lib/utils";


export function bigNumberToString(value){
    return parseFloat(formatEther(value));
}


export function formatBigNumber(value, precision){
    if(isNaN(precision)){
        precision = 10;
    }

    const decimalPlaces = Math.pow(10, precision);
    return Math.round(bigNumberToString(value) * decimalPlaces) / decimalPlaces;
}

export function formatNumber(value){
    return value.toString().replace(/(?<!(\.\d*|^.{0}))(?=(\d{3})+(?!\d))/g, ',');
}
