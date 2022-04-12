import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { addTokenNotification } from "../../components";
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


function _baseIndexTokenOperation(func){
    return async (data) => {
        const transaction = await approveBuyTokens(
            data.providerData, data.productData.address,
            data.productData.buyTokenAddress, data.amount,
        );
        await transaction.wait();

        const index = await createIndex(data.providerData.signer, data.productData.address);
        const operationTransaction = await func(index, data);

        addTokenNotification(data.providerData, data.productData);

        await operationTransaction.wait();
    };
}


async function _buyIndex(index, data) {
    return await index.buy(data.amount, { from: data.providerData.account });
}


async function _sellIndex(index, data) {
    return await index.sell(data.amount, { from: data.providerData.account });
}


export const buyIndex = _baseIndexTokenOperation(_buyIndex);
export const sellIndex = _baseIndexTokenOperation(_sellIndex);


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
            price: parseFloat(formatEther(await index.getTokenPrice(component.priceOracleAddress))).toLocaleString(),
        });

    }

    return { ratioData, priceData };
}
