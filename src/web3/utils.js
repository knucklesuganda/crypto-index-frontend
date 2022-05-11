import { formatEther } from "ethers/lib/utils";


export function formatBigNumber(amount){
    return parseFloat(formatEther(amount));
}


export function formatNumber(value){
    return value.toString().replace(/(?<!(\.\d*|^.{0}))(?=(\d{3})+(?!\d))/g, ',');
}
