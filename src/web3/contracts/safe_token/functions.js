import { ethers } from "ethers";
import AggregatorV3ABI from "@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json";


export async function getSafeTokenMintPrice() {
    
    const maticFeed = new ethers.Contract(
        '0xab594600376ec9fd91f8e885dadf0ce036862de0',
        AggregatorV3ABI.abi, 
        new ethers.providers.JsonRpcProvider() // settings.NETWORKS.POLYGON.URLS[0], settings.NETWORKS.POLYGON.ID
    );

    const roundData = await maticFeed.latestRoundData();
    return roundData.answer.mul(10);
}
