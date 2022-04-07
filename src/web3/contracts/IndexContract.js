import { ethers } from "ethers";
import contract from './sources/BaseIndex.json';

const IndexABI = contract.abi;


export function createIndex(signer, indexAddress){
    console.log(123, signer, indexAddress)
    return new ethers.Contract(indexAddress, IndexABI, signer);
}
