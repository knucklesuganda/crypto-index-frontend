import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { addTokenToWallet } from "../wallet/functions";
import { createERC20, approveBuyTokens } from "./ERC20Contract";
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


async function _approveTokens(data){
    const transaction = await approveBuyTokens(
        data.providerData, data.productData.address,
        data.productData.buyTokenAddress, data.amount,
    );
    await transaction.wait();
}


export async function buyIndex(data) {
    await _approveTokens(data);

    const index = await createIndex(data.providerData.signer, data.productData.address);
    await index.buy(data.amount, { from: data.providerData.account });

    addTokenToWallet(data.providerData, data.productData.indexToken);
}


export async function sellIndex(data) {
    await _approveTokens(data);

    const index = await createIndex(data.providerData.signer, data.productData.address);
    await index.sell(data.amount, { from: data.providerData.account });

    addTokenToWallet(data.providerData, data.productData.indexToken);
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
