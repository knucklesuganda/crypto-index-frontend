import { ethers } from "ethers";
import { addTokenNotification } from "../../components";
import { approveBuyTokens, getERC20Information, getTokenAllowance } from "./ERC20Contract";
import contract from './sources/BaseIndex.json';


const IndexABI = contract.abi;


export class BalanceError extends Error { }
export class ProductLockedError extends Error { }


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
        productToken: await getERC20Information(providerData, await product.indexToken(), productImage),
        isLocked: await product.isLocked(),
        isSettlement: await product.isSettlementActive(),
        fee: (feeData[1].toNumber() * feeData[0].toNumber()) / 100,
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
        throw new BalanceError();
    }

    const tokenAllowance = await getTokenAllowance(
        providerData, productData.buyToken.address,
        providerData.account, productData.address,
    );

    if (!tokenAllowance.gte(buyTokenAmount)) {
        const approveTransaction = await approveBuyTokens(providerData, productData.address,
            productData.buyToken.address, buyTokenAmount);
        await approveTransaction.wait();
    }

    const index = await createIndex(providerData, productData.address);
    const buyTransaction = await index.buy(amount, { from: providerData.account });

    addTokenNotification({
        providerData,
        token: productData.productToken,
        message: notificationMessage,
        productName: productData.name,
    });

    await buyTransaction.wait();
    return buyTransaction.hash;
}


export async function sellIndex(data) {
    const { providerData, productData, amount } = data;
    const productToken = productData.productToken;

    if (productToken.balance.lt(amount)) {
        throw new BalanceError();
    }

    const tokenAllowance = await getTokenAllowance(
        providerData, productData.productToken.address,
        providerData.account, productData.address,
    );

    if (!tokenAllowance.gte(amount)) {
        const approveTransaction = await approveBuyTokens(providerData, productData.address,
            productToken.address, amount);
        await approveTransaction.wait();
    }

    const index = await createIndex(providerData, productData.address);

    const sellTransaction = await index.sell(amount, { from: providerData.account });
    await sellTransaction.wait();
    return sellTransaction.hash;

}

export async function getIndexComponents(providerData, productAddress) {
    const index = createIndex(providerData, productAddress);
    const rawComponents = await index.getComponents();

    const ratioData = [];
    const priceData = [];

    for (let component of rawComponents) {
        const token = await getERC20Information(providerData, component.tokenAddress);

        ratioData.push({ type: token.name, value: component.indexPercentage });
        priceData.push({ name: token.name, token, price: await index.getTokenPrice(component) });
    }

    return { ratioData, priceData };
}

export async function retrieveIndexDebt(amount, productData, providerData) {

    const index = createIndex(providerData, productData.address);

    if (await productData.isLocked()) {
        throw new ProductLockedError();
    } else {
        const debtTransaction = await index.retrieveDebt(amount, { from: providerData.account });
        await debtTransaction.wait();
        return debtTransaction.hash;
    }

}
