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
        longDescription: await product.longDescription(),
        buyTokenAddress: await product.buyTokenAddress(),
        price: parseFloat(formatEther(await product.getPrice())).toLocaleString(),
        productToken: {
            address: indexToken.address,
            symbol: await indexToken.symbol(),
            decimals: await indexToken.decimals(),
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



export async function getIndexComponents(signer, productAddress){
    const index = createIndex(signer, productAddress);
    const rawComponents = await index.getComponents();

    const ratioData = [];
    const priceData = [];

    for (let component of rawComponents) {
        const token = createERC20(signer, component.tokenAddress);
        const tokenName = await token.name();

        ratioData.push({
            type: tokenName,
            value: component.indexPercentage,
        });

        priceData.push({
            name: tokenName,
            price: formatEther(await index.getTokenPrice(component.priceOracleAddress)).toLocaleString(),
        });

    }

    return { ratioData, priceData };
}
