import { ethers, BigNumber } from "ethers";
import { ERC20 } from "../tokens/ERC20";
import { convertToEther, parseEther } from "../../utils";
import { AmountError, BalanceError, NoTokensError } from "../errors";

export class ProductSettlementError extends Error {}
export class LiquidityError extends Error {}
export class DebtExceededError extends Error {}

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

    async _getBuyTokenBalance(buyToken){
        return await buyToken.getBalance();
    }

    async _indexOperationValidate(weiAmount){
        if (weiAmount.eq(BigNumber.from("0")) || weiAmount < BigNumber.from('10000000000000', 10)) {
            throw new AmountError();
        }

        const availableLiquidity = await this.index.getAvailableLiquidity();
        const totalManagedTokens = await this._getTotalManagedTokens();
        const isEnoughLiquidity = availableLiquidity.lt(weiAmount) || totalManagedTokens.gte(availableLiquidity);
        const isSettlement = await this.index.isSettlementActive();

        if (isSettlement) {
            throw new ProductSettlementError();
        } else if (isEnoughLiquidity) {
            throw new LiquidityError();
        }
    }

    async buy(amount) {
        const availableTokens = await this.index.availableTokens();
        const weiAmount = convertToEther(amount.toString());

        const productPrice = await this.index.getPrice();
        const approveAmount = weiAmount.mul(productPrice).div(convertToEther(1));

        if (availableTokens.lt(weiAmount)) {
            throw new NoTokensError();
        }

        await this._indexOperationValidate(weiAmount);

        const buyToken = new ERC20(await this.index.buyTokenAddress(), this.providerData);
        const buyTokenBalance = await this._getBuyTokenBalance(buyToken);

        if (buyTokenBalance.lt(approveAmount)) {
            throw new BalanceError();
        }

        const approveGas = await this._estimateApproveGas(buyToken, approveAmount);
        const approveTransaction = await this._executeApprove(buyToken, approveAmount, approveGas);

        if(approveTransaction !== null){
            await approveTransaction.wait();
        }

        const buyGas = await this._estimateBuyGas(weiAmount, approveAmount);
        const buyTransaction = await this._executeBuy(weiAmount, approveAmount, buyGas);
        await buyTransaction.wait();

        return buyTransaction.hash;
    }

    async sell(amount) {
        const weiAmount = parseEther(amount.toString());
        await this._indexOperationValidate(weiAmount);

        const productToken = new ERC20(await this.index.indexToken(), this.providerData);
        const allowance = await productToken.getAllowance(this.providerData.account, this.address);
        const balance = await productToken.getBalance();

        if (balance.lt(weiAmount)) {
            throw new BalanceError();
        } else if (!allowance.gte(weiAmount)) {
            const approveTransaction = await productToken.approve(this.address, weiAmount);
            await approveTransaction.wait();
        }

        const sellTransaction = await this.index.sell(weiAmount, { from: this.providerData.account });
        await sellTransaction.wait();

        return sellTransaction.hash;
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
            totalManagedTokens: await this._getTotalManagedTokens(),
        };
    }

    async _getTotalManagedTokens(){
        return (await this.index.tokensToBuy()).add(await this.index.tokensToSell());
    }

    async getComponents() {
        const rawComponents = await this.index.getComponents();

        const ratioData = [];
        const priceData = [];

        for (let component of rawComponents) {
            const token = new ERC20(component.tokenAddress, this.providerData);
            const tokenInfo = await token.getInformation(this.providerData, component.tokenAddress);

            ratioData.push({ type: tokenInfo.name, value: component.indexPercentage });
            priceData.push({
                token: tokenInfo,
                name: tokenInfo.name,
                productBalance: await token.getBalance(this.address),
                price: await this.index.getTokenPrice(component),
            });

        }

        return { ratioData, priceData };
    }

    async retrieveDebt(amount, isBuyDebt) {
        amount = convertToEther(amount);
        const totalDebt = await this.index.getTotalDebt(isBuyDebt);

        if(amount.eq('0')){
            throw new AmountError();
        } else if (await this.index.isSettlementActive()) {
            throw new ProductSettlementError();
        }else if(amount.gt(totalDebt)){
            throw new DebtExceededError();
        }

        const debtTransaction = await this.index.retrieveDebt(amount, isBuyDebt);
        await debtTransaction.wait();

        return debtTransaction.hash;
    }

}
