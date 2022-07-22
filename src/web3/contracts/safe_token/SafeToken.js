import SafeTokenAbi from "../sources/SafeToken.json";
import { BigNumber, Contract } from "ethers";
import { bigNumberToNumber } from "../../utils";

export class SafeToken{

    constructor(address, minterAddress, provider){
        this.address = address;
        this.provider = provider;
        this.minterAddress = minterAddress;
        this.token = new Contract(address, SafeTokenAbi.abi, provider.provider);
    }

    async getNextEpochTime(){
        const firstTransferTime = await this.token.firstTransferTime();

        const currentTimestamp = Math.round((new Date()).getTime() / 1000);
        const currentTime = BigNumber.from(currentTimestamp.toString());

        const timeDifference = currentTime.sub(firstTransferTime);
        const epochDelay = await this.token.epochDelay();
        return epochDelay.sub(timeDifference);
    }

    async getInfo(){
        const totalSupply = await this.token.totalSupply();
        const userTransferLimit = await this.token.getUserTransferLimit();
        const userSentToday = await this.token.getTodayTransferAmount(this.provider.account);
        const userLeftLimit = userTransferLimit.sub(userSentToday);

        const totalTransferLimit = await this.token.getTotalTransferLimit();
        const totalSentToday = await this.token.epochTokensTransferred();
        const totalLeftLimit = totalTransferLimit.sub(totalSentToday);

        const nextEpochTime = await this.getNextEpochTime();
        const currentTimestamp = (new Date()).getTime();
        const nextResetTime = new Date(currentTimestamp + (nextEpochTime.toNumber() * 1000));

        return {
            totalSupply,
            nextResetTime,
            maxTransferPercentage: await this.token.maxSupplyTransferPercentage(),

            userTransferLimit,
            userLeftLimit,
            userLeftPercentage: 100 / bigNumberToNumber(userTransferLimit.div(userLeftLimit)),

            totalLeftLimit,
            totalLeftPercentage: 100 / bigNumberToNumber(totalTransferLimit.div(totalLeftLimit)),
            totalTransferLimit,

            mintSupply: totalSupply.sub(await this.token.balanceOf(this.minterAddress)),
        };
    }

}
