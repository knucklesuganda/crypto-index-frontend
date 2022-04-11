import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { createERC20 } from "./ERC20Contract";
import contract from './sources/BaseIndex.json';

const IndexABI = contract.abi;


export function createIndex(signer, indexAddress) {
    return new ethers.Contract(indexAddress, IndexABI, signer);
}


export async function getIndexInformation(signer, indexAddress) {
    const product = createIndex(signer, indexAddress);
    const indexToken = createERC20(signer, await product.indexToken());

    return {
        image: "https://picsum.photos/200",
        address: indexAddress,
        title: await product.name(),
        description: await product.shortDescription(),
        buyTokenAddress: await product.buyTokenAddress(),
        price: parseFloat(formatEther(await product.getPrice())).toLocaleString(),
        productToken: {
            address: indexToken.address,
            symbol: indexToken.symbol,
            decimals: indexToken.decimals,
            image: "https://picsum.photos/200",
        },
    };
}

export async function buyIndex(providerData, indexAddress, amount) {
    const index = createIndex(providerData.signer, indexAddress);
    return await index.buy(amount, { from: providerData.account });
}


export async function sellIndex(providerData, indexAddress, amount){
    const index = createIndex(providerData.signer, indexAddress);
    return await index.sell(amount, { from: providerData.account });
}
