import { ethers } from "ethers";
import ERC20ABI from '../sources/ERC20.json';


export class ERC20 {

    constructor(address, providerData) {
        this.index = new ethers.Contract(address, ERC20ABI.abi, providerData.signer);
        this.providerData = providerData;
        this.address = address;
    }

    async approve(approvalAddress, amount) {
        return await this.token.approve(approvalAddress, amount, { from: this.providerData.account });
    }

    async getInformation() {
        let symbol = this.token.address;
        let name = this.token.address;
        let image = null;

        try { symbol = await this.token.symbol(); } catch (error) { }
        try { name = await this.token.name(); } catch (error) { }
        try { image = await this.token.image(); } catch (error) { }

        return {
            name,
            symbol,
            image,
            address: this.token.address,
            decimals: await this.token.decimals(),
            balance: await this.token.balanceOf(this.providerData.account),
        };
    }

    async getTotalSupply() {
        return await this.token.totalSupply();
    }

    async getBalance(account) {
        return await this.token.balanceOf(account ? account : this.providerData.account);
    }

    async getAllowance(owner, spender) {
        return await this.token.allowance(owner, spender);
    }

}
