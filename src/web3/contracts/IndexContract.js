import { ethers } from "ethers";
import { addTokenNotification } from "../../components";
import { createERC20, approveBuyTokens, getERC20Information } from "./ERC20Contract";
import contract from './sources/BaseIndex.json';
import { message } from "antd";
import { formatBigNumber } from "../utils";


const IndexABI = contract.abi;


export function createIndex(providerData, indexAddress) {
    return new ethers.Contract(indexAddress, IndexABI, providerData.signer);
}


export async function getIndexInformation(providerData, indexAddress) {
    const product = createIndex(providerData, indexAddress);
    const productImage = await product.image();

    return {
        address: indexAddress,
        image: productImage,
        name: await product.name(),
        description: await product.shortDescription(),
        longDescription: await product.longDescription(),
        price: await product.getPrice(),
        productToken: await getERC20Information(
            providerData, await product.indexToken(), productImage,
        ),
        totalLockedValue: await product.getTotalLockedValue(),
        userDebt: await product.usersDebt(providerData.account),
        totalAvailableDebt: await product.totalAvailableDebt(),
        buyToken: await getERC20Information(providerData, await product.buyTokenAddress()),
    };
}


function _baseIndexTokenOperation(func) {
    return async (data) => {    // TODO: translation. Check that index is not locked
        const { providerData, productData, exchangeToken, amount } = data;

        if (exchangeToken.balance.lt(amount)) {
            throw new Error(
                `You don't have enough tokens. Your balance: ${formatBigNumber(exchangeToken.balance)}
                    ${exchangeToken.symbol}`
            );
        }

        const approveTransaction = await approveBuyTokens(
            providerData, productData.address, exchangeToken.address, amount);
        await approveTransaction.wait();

        const index = await createIndex(providerData, productData.address);
        const operationTransaction = await func(index, amount, providerData.account);

        addTokenNotification(providerData, productData.productToken);
        await operationTransaction.wait();
    };
}


async function _buyIndex(index, amount, account) {
    return await index.buy(amount, { from: account });
}


async function _sellIndex(index, amount, account) {
    return await index.sell(amount, { from: account });
}


export const buyIndex = _baseIndexTokenOperation(_buyIndex);
export const sellIndex = _baseIndexTokenOperation(_sellIndex);


export async function getIndexComponents(providerData, productAddress) {
    const index = createIndex(providerData, productAddress);
    const rawComponents = await index.getComponents();

    const ratioData = [];
    const priceData = [];

    for (let component of rawComponents) {
        const token = createERC20(providerData, component.tokenAddress);
        let tokenName = token.address;

        try {
            tokenName = await token.name();
        } catch (error) { }

        ratioData.push({
            type: tokenName,
            value: component.indexPercentage,
        });

        priceData.push({
            name: tokenName,
            token: await getERC20Information(providerData, component.tokenAddress),
            price: await index.getTokenPrice(component.priceOracleAddress),
        });

    }

    return { ratioData, priceData };
}


export async function retrieveIndexDebt(amount, productData, providerData){

    const index = createIndex(providerData, productData.address);

    if(await productData.isLocked()){   // TODO: translation
        message.error("This product is locked, you cannot withdraw your funds, only sell the tokens");
    }else{
        const debtTransaction = await index.retrieveDebt(amount, { from: providerData.account });
        await debtTransaction.wait();
    }

}
