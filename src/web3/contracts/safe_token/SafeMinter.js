import { Contract, providers, BigNumber } from "ethers";
import { SafeToken } from "./SafeToken";
import { convertToEther } from "../../utils";
import SafeMinterABI from "../sources/SafeMinter.json";
import AggregatorV3ABI from "@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json";
import { AmountError } from "../index";


export class SafeMinter {

    constructor(address, provider) {
        this.address = address;
        this.provider = provider;
        this.minter = new Contract(address, SafeMinterABI.abi, provider.signer);
        this.token = null;
    }

    async getToken() {
        const tokenAddress = await this.minter.token();
        return new SafeToken(tokenAddress, this.address, this.provider);
    }

    async mint(amount) {
        amount = convertToEther(amount);

        if(amount.eq(0)){
            throw new AmountError();
        }

        const transaction = await this.minter.mint({ value: amount });
        console.log(transaction)
        await transaction.wait();

    }

    async getPrice() {
        const maticFeed = new Contract(
            '0xab594600376ec9fd91f8e885dadf0ce036862de0',
            AggregatorV3ABI.abi,
            new providers.JsonRpcProvider() // settings.NETWORKS.POLYGON.URLS[0], settings.NETWORKS.POLYGON.ID
        );

        const roundData = await maticFeed.latestRoundData();
        return roundData.answer.mul(BigNumber.from("10").pow("10")).mul(10);
    }

}
