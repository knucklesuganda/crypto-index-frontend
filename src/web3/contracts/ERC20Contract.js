import { ethers } from "ethers";
import contract from './sources/ERC20.json';

const ERC20ABI = contract.abi


export function createERC20(providerData, tokenAddress){
    return new ethers.Contract(tokenAddress, ERC20ABI, providerData.signer);
}


export async function approveBuyTokens(providerData, productAddress, buyTokenAddress, amount){

    const token = await createERC20(providerData, buyTokenAddress);
    return await token.approve(productAddress, amount, { from: providerData.account });

}


export async function approveIndexTokens(providerData, productData, amount){

    const token = await createERC20(providerData, productData.productToken.address);
    return await token.approve(productData.address, amount, { from: providerData.account });

}

export async function getERC20Information(providerData, tokenAddress, isProductToken){
    const token = createERC20(providerData, tokenAddress);

    return {
        address: token.address,
        symbol: await token.symbol(),
        decimals: await token.decimals(),
        image: isProductToken ? await token.image() : 
            `https://raw.githubusercontent.com/TrustWallet/tokens/master/images/${token.address}.png`,
        balance: await token.balanceOf(providerData.account),
    };

}
