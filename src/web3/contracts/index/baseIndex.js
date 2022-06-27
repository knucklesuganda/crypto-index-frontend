
import { ethers } from "ethers";
import { ERC20 } from "../tokens/erc20";


export class BalanceError extends Error { }
export class ProductSettlementError extends Error { }


export class BaseIndex {
    constructor(address, abi, providerData) {
        this.index = new ethers.Contract(address, abi, providerData.signer);
        this.providerData = providerData;
        this.address = address;
    }

    async _estimateBuyGas(amount, approveAmount) {
        throw new Error("Function is not overriden");
    }

    async _estimateApproveGas(amount, approveAmount) {
        throw new Error("Function is not overriden");
    }

    async buy(amount, approveAmount) {
        const buyToken = new ERC20(await this.index.buyTokenAddress(), this.providerData);
        const buyTokenBalance = await buyToken.getBalance();

        if (buyTokenBalance.lt(approveAmount)) {
            throw new BalanceError();
        }

        const approveGas = await this._estimateApproveGas(buyToken, approveAmount);
        const approveTransaction = await this._executeApprove(token, approveAmount, approveGas);
        await approveTransaction.wait();

        const buyGas = await this._estimateBuyGas(amount, approveAmount);
        const buyTransaction = await this._executeBuy(amount, approveAmount, buyGas);
        await buyTransaction.wait();

        return buyTransaction.hash;
    }

    async _executeBuy(amount, approveAmount, gasEstimation) {
        throw new Error("Function is not overriden");
    }

    async _executeApprove(amount, approveAmount, gasEstimation) {
        throw new Error("Function is not overriden");
    }

    async getInformation() {
        const productImage = await this.index.image();
        const feeData = await this.index.getFee();

        const indexToken = new ERC20(await this.index.indexToken(), this.providerData);
        const buyToken = new ERC20(await this.index.buyTokenAddress(), this.providerData);

        return {
            address: this.address,
            image: productImage,
            price: await this.index.getPrice(),
            name: await this.index.name(),
            description: await this.index.shortDescription(),

            longDescription: await this.index.longDescription(),
            isSettlement: await this.index.isSettlementActive(),
            totalLockedValue: await this.index.getTotalLockedValue(),
            userSellDebt: await this.index.getUserDebt(this.providerData.account, false),
            userBuyDebt: await this.index.getUserDebt(this.providerData.account, true),
            totalSellDebt: await this.index.getTotalDebt(false),
            totalBuyDebt: await this.index.getTotalDebt(true),

            fee: (100 / feeData[1].toNumber()) * feeData[0].toNumber(),
            availableLiquidity: await this.index.getAvailableLiquidity(),
            maxTokens: await indexToken.getTotalSupply(),
            availableTokens: await this.index.availableTokens(),

            buyToken: await buyToken.getInformation(),
            productToken: await indexToken.getInformation(),
            totalManagedTokens: (await this.index.tokensToBuy()).add(await this.index.tokensToSell()),
        };
    }

    async sell(amount) {
        const productToken = new ERC20(await this.index.productToken(), this.providerData);
        const allowance = await productToken.getAllowance(this.providerData.account, this.address);
        const balance = await productToken.getBalance();

        if (balance.lt(amount)) {
            throw new BalanceError();
        } else if (!allowance.gte(amount)) {
            const approveTransaction = await productToken.approve(this.address, amount);
            await approveTransaction.wait();
        }

        const sellTransaction = await this.index.sell(amount, { from: this.providerData.account });
        await sellTransaction.wait();

        return sellTransaction.hash;
    }

    async getComponents() {
        const rawComponents = await this.index.getComponents();

        const ratioData = [];
        const priceData = [];

        for (let component of rawComponents) {
            const token = new ERC20(component.tokenAddress, this.providerData);
            const tokenInfo = await token.getInformation(this.providerData, component.tokenAddress);

            ratioData.push({
                type: tokenInfo.name,
                value: component.indexPercentage,
            });

            priceData.push({
                token: tokenInfo,
                name: tokenInfo.name,
                productBalance: await token.getBalance(this.address),
                price: await index.getTokenPrice(component),
            });
        }

        return { ratioData, priceData };
    }

    async retrieveDebt(amount, isBuyDebt) {
        if (await this.index.isSettlement()) {
            throw new ProductSettlementError();
        }

        const debtTransaction = await this.index.retrieveDebt(amount, isBuyDebt, { from: this.providerData.account });
        await debtTransaction.wait();
        return debtTransaction.hash;
    }

}
