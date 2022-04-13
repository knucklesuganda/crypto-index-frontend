import { ethers } from "ethers";
import { addTokenNotification } from "../../components";
import { createERC20, approveBuyTokens, getERC20Information } from "./ERC20Contract";
import contract from './sources/BaseIndex.json';

const IndexABI = contract.abi;


export function createIndex(providerData, indexAddress) {
    return new ethers.Contract(indexAddress, IndexABI, providerData.signer);
}


export async function getIndexInformation(providerData, indexAddress) {
    const product = createIndex(providerData, indexAddress);

    return {
        address: indexAddress,
        image: await product.image(),
        name: await product.name(),
        description: await product.shortDescription(),
        longDescription: await product.longDescription(),
        price: await product.getPrice(),
        productToken: await getERC20Information(providerData, await product.indexToken()),
        buyToken: await getERC20Information(providerData, await product.buyTokenAddress()),
    };
}


function _baseIndexTokenOperation(func){
    return async (data) => {
        if(data.productData.buyToken.balance < data.amount){
            throw new Error(`You don't have enough tokens. Your balance: ${data.productData.buyToken.balance}`);
        }

        const transaction = await approveBuyTokens(
            data.providerData, data.productData.address,
            data.productData.buyToken.address, data.amount,
        );
        await transaction.wait();

        const index = await createIndex(data.providerData, data.productData.address);
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


export async function getIndexComponents(providerData, productAddress){
    const index = createIndex(providerData, productAddress);
    const rawComponents = await index.getComponents();

    const ratioData = [];
    const priceData = [];

    for (let component of rawComponents) {
        const token = createERC20(providerData, component.tokenAddress);
        let tokenName = token.address;

        try{
            tokenName = await token.name();
        }catch(error){}

        ratioData.push({
            type: tokenName,
            value: component.indexPercentage,
        });

        priceData.push({
            name: tokenName,
            price: await index.getTokenPrice(component.priceOracleAddress),
        });

    }

    console.log({ ratioData, priceData });
    return { ratioData, priceData };
}
