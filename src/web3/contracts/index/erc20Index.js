import { BaseIndex } from "./baseIndex";
import Index from "../sources/Index.json";


export class ERC20Index extends BaseIndex {
    constructor(address, providerData) {
        super(address, Index.abi, providerData);
    }

    async _estimateBuyGas(amount, approveAmount) {
        try {
            return await this.index.estimateGas.buy(amount, { from: this.providerData.account });
        } catch (error) {
            return 1000000;
        }
    }

    async _estimateApproveGas(token, approveAmount) {
        try {
            return await token.estimateGas.approve(approveAmount, { from: this.providerData.account });
        } catch (error) {
            return 100000;
        }
    }

    async _executeBuy(amount, approveAmount, gasEstimation) {
        return await this.index.buy(amount, { from: this.providerData.account, gasLimit: gasEstimation });
    }

    async _executeApprove(token, amount, gasEstimation) {
        return await token.approve(amount, { from: this.providerData.account, gasLimit: gasEstimation });
    }

}
