import { ethers } from "ethers";
import contract from './sources/BaseIndex.json';

const IndexABI = contract.abi;


export function createIndex(signer, indexAddress) {
    return new ethers.Contract(indexAddress, IndexABI, signer);
}


export async function getIndexInformation(signer, indexAddress) {
    const product = createIndex(signer, indexAddress);

    return {
        image: "https://picsum.photos/200",
        address: indexAddress,
        title: await product.name(),
        description: await product.shortDescription(),
        buyTokenAddress: await product.buyTokenAddress(),
    };
}

export async function buyIndex(providerData, indexAddress, amount){
    const index = createIndex(providerData.signer, indexAddress);
    return await index.buy(amount, { from: providerData.account });

}
