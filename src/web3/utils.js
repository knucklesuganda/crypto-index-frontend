import { formatEther } from "ethers/lib/utils";


export function formatBigNumber(value){
    const decimalPlaces = Math.pow(10, 3);
    return Math.round(parseFloat(formatEther(value)) * decimalPlaces) / decimalPlaces;
}

export function formatNumber(value){
    return value.toString().replace(/(?<!(\.\d*|^.{0}))(?=(\d{3})+(?!\d))/g, ',');
}
