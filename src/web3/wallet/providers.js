import { getEthereum } from "./functions";
import { ethers } from "ethers";


const ethereum = getEthereum();
let provider, signer;

if(!ethereum){
    provider = null;
    signer = null;
}else{
    provider = new ethers.providers.Web3Provider(ethereum);
    signer = provider.getSigner();
}


export { provider, signer };
