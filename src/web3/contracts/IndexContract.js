import { ethers } from "ethers";
import contract from './sources/BaseIndex.json';

const IndexABI = contract.abi;


export function createIndex(signer, indexAddress){
    return new ethers.Contract(indexAddress, IndexABI, signer);
}
