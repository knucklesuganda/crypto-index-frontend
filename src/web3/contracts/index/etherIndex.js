import { BaseIndex } from "./baseIndex";
import ETHIndex from "../sources/ETHIndex.json";


export class EtherIndex extends BaseIndex {
    constructor(address, providerData) {
        super(address, ETHIndex.abi, providerData);
    }

    async _estimateBuyGas(amount, approveAmount) {
        try {
            return await this.index.estimateGas.buy(amount, { value: approveAmount });
        } catch (error) {
            return 1000000;
        }
    }

    async _executeBuy(amount, approveAmount, gasEstimation) {
        try {
            return await this.index.buy(amount, { value: approveAmount, gasLimit: gasEstimation });
        }catch(error){
            throw new Error("Unknown error");
        }
    }

    async _estimateApproveGas(token, approveAmount) { }
    async _executeApprove(token, amount, gasEstimation) { }

    async getInformation() {
        return {
            ...super(),
            buyToken: {
                name: "Ether",
                symbol: "ETH",
                address: buyToken.address,
                decimals: buyToken.decimals,
                image: buyToken.tokenImage,
                balance: await providerData.provider.getBalance(providerData.account),
            },
        };
    }

}
