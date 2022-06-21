import { ethers } from "ethers";
import { BalanceError, ProductSettlementError } from "./IndexContract";
import {
    approveBuyTokens, getERC20Information, getTokenAllowance, getTokenBalance, getTotalSupply,
} from "./ERC20Contract";
import contract from './sources/ETHIndex.json';

const IndexABI = contract.abi;


export function createIndex(providerData, indexAddress) {
    return new ethers.Contract(indexAddress, IndexABI, providerData.signer);
}

export async function buyIndex(data) {
    const { providerData, productData, amount, approveAmount } = data;
    const ethBalance = await providerData.provider.getBalance(providerData.account);

    if (ethBalance.lt(approveAmount)) {
        throw new BalanceError();
    }

    const index = await createIndex(providerData, productData.address);
    const buyTransaction = await index.buyETH(amount, { from: providerData.account, value: approveAmount });

    await buyTransaction.wait();
    return buyTransaction.hash;
}


export async function getIndexInformation(providerData, indexAddress) {
    const product = createIndex(providerData, indexAddress);
    const productImage = await product.image();
    const feeData = await product.getFee();
    const indexToken = await product.indexToken();

    const buyToken = await getERC20Information(providerData, await product.buyTokenAddress());

    return {
        address: indexAddress,
        image: productImage,
        name: await product.name(),
        description: await product.shortDescription(),
        longDescription: await product.longDescription(),
        price: await product.getPrice(),
        productToken: await getERC20Information(providerData, indexToken, productImage),
        isSettlement: await product.isSettlementActive(),
        totalLockedValue: await product.getTotalLockedValue(),
        userSellDebt: await product.getUserDebt(providerData.account, false),
        userBuyDebt: await product.getUserDebt(providerData.account, true),
        totalSellDebt: await product.getTotalDebt(false),
        totalBuyDebt: await product.getTotalDebt(true),
        fee: (100 / feeData[1].toNumber()) * feeData[0].toNumber(),
        availableLiquidity: await product.getAvailableLiquidity(),
        maxTokens: await getTotalSupply(providerData, indexToken),
        availableTokens: await product.availableTokens(),
        buyToken: {
            name: "Ether",
            symbol: "ETH",
            address: buyToken.address,
            decimals: await buyToken.decimals(),
            image: buyToken.tokenImage,
            balance: await providerData.provider.getBalance(providerData.account),
        },
        totalManagedTokens: (await product.tokensToBuy()).add(await product.tokensToSell()),
    };
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
        const approveTransaction = await approveBuyTokens(
            providerData, productData.address, productToken.address, amount,
        );
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
        priceData.push({
            token,
            name: token.name,
            productBalance: await getTokenBalance(providerData, token.address, productAddress),
            price: await index.getTokenPrice(component),
        });
    }

    return { ratioData, priceData };
}

export async function retrieveIndexDebt(data) {
    const { isSettlement, providerData, productAddress, amount, isBuyDebt } = data;
    const index = createIndex(providerData, productAddress);

    if (isSettlement) {
        throw new ProductSettlementError();
    } else {

        const debtTransaction = await index.retrieveDebt(amount, isBuyDebt, { from: providerData.account });
        await debtTransaction.wait();
        return debtTransaction.hash;

    }

}
