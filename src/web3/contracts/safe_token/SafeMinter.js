import { Contract } from "ethers";
import { SafeToken } from "./SafeToken";
import SafeMinterABI from "../sources/SafeMinter.json";


export class SafeMinter{

    constructor(address, provider){
        this.address = address;
        this.provider = provider;
        this.minter = new Contract(address, SafeMinterABI.abi, provider.provider);
        this.token = null;
    }

    async getToken(){
        const tokenAddress = await this.minter.token();
        return new SafeToken(tokenAddress, this.address, this.provider);
    }

}
