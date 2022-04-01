import { ethers } from "ethers";
import contract from './sources/ERC20.json';

const ERC20ABI = contract.abi


export function createERC20(signer, tokenAddress){
    return new ethers.Contract(tokenAddress, ERC20ABI, signer);
}
