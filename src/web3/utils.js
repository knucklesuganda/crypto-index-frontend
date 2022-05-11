import { formatEther } from "ethers/lib/utils";


export function formatBigNumber(amount){
    const decimalPlaces = Math.pow(10, 3);
    return Math.round(parseFloat(formatEther(amount)) * decimalPlaces) / decimalPlaces;
}


export function formatNumber(value){
    return value.toString().replace(/(?<!(\.\d*|^.{0}))(?=(\d{3})+(?!\d))/g, ',');
}
