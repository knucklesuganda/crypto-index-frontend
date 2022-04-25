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

export async function getERC20Information(providerData, tokenAddress, tokenImage){
    const token = createERC20(providerData, tokenAddress);

    let symbol = token.address;
    let name = token.address;

    try{ symbol = await token.symbol() }catch(error){}
    try{ name = await token.name() }catch(error){}

    return {
        name,
        symbol,
        address: token.address,
        decimals: await token.decimals(),
        image: tokenImage ? tokenImage : 
            `https://raw.githubusercontent.com/TrustWallet/tokens/master/images/${token.address}.png`,
        balance: await token.balanceOf(providerData.account),
    };

}
