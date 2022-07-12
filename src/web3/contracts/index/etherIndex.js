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
            return await this.index.buyETH(amount, { value: approveAmount, gasLimit: gasEstimation });
        }catch(error){
            console.log(error)
            throw new Error("Unknown error");
        }
    }

    async _getBuyTokenBalance(buyToken){
        const { provider, account } = this.providerData;
        return await provider.getBalance(account);
    }

    async _estimateApproveGas(token, approveAmount) { return null; }
    async _executeApprove(token, amount, gasEstimation) { return null; }

    async getInformation() {
        const information = await super.getInformation();

        return {
            ...information,
            buyToken: {
                name: "Ether",
                symbol: "ETH",
                address: information.buyToken.address,
                decimals: information.buyToken.decimals,
                image: information.buyToken.tokenImage,
                balance: await this.providerData.provider.getBalance(this.providerData.account),
            },
        };
    }

}
