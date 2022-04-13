import { formatEther } from "ethers/lib/utils";


export function formatBigNumber(amount){
    return parseFloat(formatEther(amount)).toLocaleString();
}
