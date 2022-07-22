import SafeTokenAbi from "../sources/SafeToken.json";
import { Contract } from "ethers";

export class SafeToken{

    constructor(address, minterAddress, provider){
        this.address = address;
        this.provider = provider;
        this.minterAddress = minterAddress;
        this.token = new Contract(address, SafeTokenAbi.abi, provider.provider);
    }

    async getInfo(){
        const totalSupply = await this.token.totalSupply();
        const lastBlock = await this.provider.provider.getBlock();

        const timeDifference = (lastBlock.timestamp - (await this.token.lastTransferTime())).toString();
        const epochDelay = (await this.token.epochDelay()).toString();

        return {
            totalSupply,
            mintSupply: totalSupply.sub(await this.token.balanceOf(this.minterAddress)),
            nextReset: new Date((new Date()).getTime() + (epochDelay - timeDifference) * 60000),
        };
    }

}
