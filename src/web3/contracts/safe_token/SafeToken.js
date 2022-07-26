import SafeTokenAbi from "../sources/SafeToken.json";
import { BigNumber, Contract } from "ethers";
import { bigNumberToNumber } from "../../utils";
import { LimitExceededError, TotalLimitExceededError } from "./errors";


export class SafeToken {

    constructor(address, minterAddress, providerData) {
        this.address = address;
        this.providerData = providerData;
        this.minterAddress = minterAddress;
        this.token = new Contract(address, SafeTokenAbi.abi, providerData.signer);
    }

    async getNextEpochTime() {
        const firstTransferTime = await this.token.firstTransferTime();

        const currentTimestamp = Math.round((new Date()).getTime() / 1000);
        const currentTime = BigNumber.from(currentTimestamp.toString());

        const timeDifference = currentTime.sub(firstTransferTime);
        const epochDelay = await this.token.epochDelay();
        return epochDelay.sub(timeDifference);
    }

    async getMintSupply(){
        return await this.token.balanceOf(this.minterAddress);
    }

    async burn(amount){
        const currentTick = await this.token.currentTick();
        const todayTransfers = await this.token.todayTransfers(currentTick, this.providerData.account);
        const userTransferLimit = await this.token.getUserTransferLimit();
        const epochTokensTransferred = await this.token.epochTokensTransferred();
        const totalTransferLimit = await this.token.getTotalTransferLimit();

        if(todayTransfers.gt(userTransferLimit)){
            throw new LimitExceededError();
        }else if(epochTokensTransferred.gte(totalTransferLimit)){
            throw new TotalLimitExceededError();
        }

        return await this.token.burn(amount);
    }

    async balanceOf(tokenAddress){
        return this.token.balanceOf(tokenAddress);
    }

    async getInfo() {
        const totalSupply = await this.token.totalSupply();
        const userTransferLimit = await this.token.getUserTransferLimit();

        let userSentToday;

        if(this.providerData.account === null){
            userSentToday = BigNumber.from("0");
        }else{
            const currentTick = await this.token.currentTick();
            userSentToday = await this.token.todayTransfers(currentTick, this.providerData.account);
        }

        let userLeftLimit = userTransferLimit.sub(userSentToday);

        const totalTransferLimit = await this.token.getTotalTransferLimit();
        const totalSentToday = await this.token.epochTokensTransferred();
        let totalLeftLimit = totalTransferLimit.sub(totalSentToday);

        if (totalLeftLimit.lt(userLeftLimit)) {
            userLeftLimit = totalLeftLimit;
        }

        if(userLeftLimit.lt("0")){ userLeftLimit = BigNumber.from("0"); }
        if(totalLeftLimit.lt("0")){ totalLeftLimit = BigNumber.from("0"); }

        const nextEpochTime = (await this.getNextEpochTime()).toNumber();
        let nextResetTime = null;
        
        if(nextEpochTime > 0){
            const currentTimestamp = (new Date()).getTime();
            nextResetTime = new Date(currentTimestamp + (nextEpochTime * 1000));
        }

        return {
            totalSupply,
            mintSupply: await this.getMintSupply(),

            nextResetTime,
            maxTransferPercentage: await this.token.maxSupplyTransferPercentage(),

            userTransferLimit,
            userLeftLimit, 
            userLeftPercentage: 100 / (bigNumberToNumber(userTransferLimit) / bigNumberToNumber(
                userLeftLimit.eq("0") ? BigNumber.from("1") : userLeftLimit
            )),

            totalLeftLimit,
            totalLeftPercentage: 100 / (bigNumberToNumber(totalTransferLimit) / bigNumberToNumber(
                totalLeftLimit.eq("0") ? BigNumber.from("1") : totalLeftLimit)),
            totalTransferLimit,

            token: {
                symbol: await this.token.symbol(),
                decimals: await this.token.decimals(),
                address: this.address,
                image: "",
            }
        };
    }

}
