import { getEthereum } from "./functions";
import { ethers } from "ethers";


const ethereum = getEthereum();
export const provider = new ethers.providers.Web3Provider(ethereum);
export const signer = provider.getSigner();
