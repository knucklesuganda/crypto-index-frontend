import { ethers } from "ethers";
import contract from './sources/ERC20.json';

const ERC20ABI = contract.abi


export function createERC20(signer, tokenAddress){
    return new ethers.Contract(tokenAddress, ERC20ABI, signer);
}


export async function approveBuyTokens(providerData, productAddress, buyTokenAddress, amount){

    const token = await createERC20(providerData.signer, buyTokenAddress);
    return await token.approve(productAddress, amount, { from: providerData.account });

}


export async function approveIndexTokens(providerData, productData, amount){

    const token = await createERC20(providerData.signer, productData.productToken.address);
    return await token.approve(productData.address, amount, { from: providerData.account });

}
