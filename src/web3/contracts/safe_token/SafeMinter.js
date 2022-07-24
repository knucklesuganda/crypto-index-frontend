import { convertToEther } from "../../utils";
import { Contract, BigNumber } from "ethers";
import { SafeToken } from "./SafeToken";
import SafeMinterABI from "../sources/SafeMinter.json";
import { AmountError, BalanceError, NoTokensError } from "../errors";
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

    async mint(amount) {
        amount = convertToEther(amount);
        const { provider, account } = this.providerData;
        const userBalance = await provider.getBalance(account);

        const safeToken = await this.getToken();
        const mintSupply = await safeToken.getMintSupply();

        if(amount.eq(0)){
            throw new AmountError();
        }else if(amount.gt(userBalance)){
            throw new BalanceError();
        }else if(amount.gt(mintSupply)){
            throw new NoTokensError();
        }

        const transaction = await this.minter.mint({ value: amount.div(BigNumber.from("10")) });
        await transaction.wait();

        return transaction;
    }

    async getPrice() {
        const maticFeed = new Contract(
            '0xab594600376ec9fd91f8e885dadf0ce036862de0', AggregatorV3ABI.abi, this.providerData.signer,
        );
        const roundData = await maticFeed.latestRoundData();
        return roundData.answer.mul(BigNumber.from("10").pow("10")).mul(10);
    }

}
