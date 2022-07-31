import { SafeToken } from "./SafeToken";
import { Contract, BigNumber } from "ethers";
import SafeMinterABI from "../sources/SafeMinter.json";
import { AmountError, BalanceError, NoTokensError } from "../errors";
import { bigNumberToNumber, convertToEther, formatNumber } from "../../utils";
import AggregatorV3ABI from "@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json";


export class SafeMinter {

    constructor(address, provider) {
        this.address = address;
        this.providerData = provider;
        this.minter = new Contract(address, SafeMinterABI.abi, provider.signer);
    }

    async getToken() {
        const tokenAddress = await this.minter.token();
        return new SafeToken(tokenAddress, this.address, this.providerData);
    }

    async burn(amount){
        amount = convertToEther(amount).div(BigNumber.from("100"));

        const token = await this.getToken();
        const userBalance = await token.balanceOf(this.providerData.account);

        try{
            this._checkBalanceErrors(amount, userBalance);
        }catch(error){

            if(error instanceof BalanceError){
                error.balance = `${userBalance} SAFE`;
            }

            throw error;
        }

        return await token.burn(amount);
    }

    _checkBalanceErrors(amount, balance){
        if (amount.eq(0)) {
            throw new AmountError();
        } else if (amount.gt(balance)) {
            const balanceError = new BalanceError();
            balanceError.balance = `${formatNumber(bigNumberToNumber(balance))} MATIC`;
            throw balanceError;
        }
    }

    async mint(amount) {
        amount = convertToEther(amount).div(BigNumber.from("100"));
        const { provider, account } = this.providerData;
        const userBalance = await provider.getBalance(account);

        const safeToken = await this.getToken();
        const mintSupply = await safeToken.getMintSupply();

        this._checkBalanceErrors(amount, userBalance);

        if (amount.gt(mintSupply)) {
            throw new NoTokensError();
        }

        const transaction = await this.minter.mint({ value: amount });
        await transaction.wait();

        return transaction;
    }

    async getPrice() {
        const maticFeed = new Contract(
            '0xab594600376ec9fd91f8e885dadf0ce036862de0', AggregatorV3ABI.abi, this.providerData.signer,
        );
        const roundData = await maticFeed.latestRoundData();
        return roundData.answer.mul(BigNumber.from("10").pow("8"));
    }

}
