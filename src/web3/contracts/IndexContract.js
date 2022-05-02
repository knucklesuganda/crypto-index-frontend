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
    const feeData = await product.getFee();

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
        isLocked: await product.isLocked(),
        fee: feeData[0].toNumber() / feeData[1].toNumber(),
        totalLockedValue: await product.getTotalLockedValue(),
        userDebt: await product.usersDebt(providerData.account),
        totalAvailableDebt: await product.totalAvailableDebt(),
        buyToken: await getERC20Information(providerData, await product.buyTokenAddress()),
    };
}

export async function buyIndex(data) {
    const { providerData, productData, amount, notificationMessage } = data;
    const buyTokenAmount = productData.price.mul(amount).div(ethers.BigNumber.from('10').pow(18));

    if (productData.buyToken.balance.lt(buyTokenAmount)) {
        throw new Error(
            `You do not have enough tokens. Your balance: ${formatBigNumber(productData.buyToken.balance)}
                    ${productData.buyToken.symbol}`
        );
    }

    const approveTransaction = await approveBuyTokens(providerData, productData.address,
        productData.buyToken.address, buyTokenAmount);
    await approveTransaction.wait();

    const index = await createIndex(providerData, productData.address);
    const buyTransaction = await index.buy(amount, { from: providerData.account });

    addTokenNotification({
        providerData,
        token: productData.productToken,
        message: notificationMessage,
        productName: productData.name,
    });
    await buyTransaction.wait();
    message.info(`Buy transaction succeeded: ${buyTransaction.hash}`);
}


export async function sellIndex(data) {
    const { providerData, productData, amount, notificationMessage } = data;
    const productToken = productData.productToken;

    if (productToken.balance.lt(amount)) {
        throw new Error(
            `You do not have enough tokens. Your balance: ${formatBigNumber(productToken.balance)}
                    ${productToken.symbol}`
        );
    }

    const approveTransaction = await approveBuyTokens(providerData, productData.address, productToken.address, amount);
    await approveTransaction.wait();

    const index = await createIndex(providerData, productData.address);
    const sellTransaction = await index.sell(amount, { from: providerData.account });

    addTokenNotification(providerData, productToken, notificationMessage);
    await sellTransaction.wait();
    message.info(`Sell transaction succeeded: ${sellTransaction.hash}`);
}

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


export async function retrieveIndexDebt(amount, productData, providerData) {

    const index = createIndex(providerData, productData.address);

    if (await productData.isLocked()) {   // TODO: translation
        message.error("This product is locked, you cannot withdraw your funds, only sell the tokens");
    } else {
        const debtTransaction = await index.retrieveDebt(amount, { from: providerData.account });
        await debtTransaction.wait();
    }

}
