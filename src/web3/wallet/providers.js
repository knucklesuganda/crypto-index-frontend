import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { setupEvents } from "./events";
// import WalletConnectProvider from '@walletconnect/web3-provider';


let web3Modal;

const providerOptions = {
    // walletconnect: {
    //     package: WalletConnectProvider,
    //    options: {
    //        rpc: {
    //            1337: process.env.PUBLIC_RPC_URL,
    //        }
    //    },
    // }
};


let signer = null, provider = null;


export async function connectWallet() {
    if(provider !== null && signer !== null){
        return { account: await _getWallet(), signer, provider};
    }

    web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
    });

    const web3ModalProvider = await web3Modal.connect();
    provider = new ethers.providers.Web3Provider(web3ModalProvider);
    signer = provider.getSigner();
    setupEvents(provider);

    return { account: await _getWallet(), signer, provider};
}


export async function _getWallet() {
    return (await provider.listAccounts())[0];
}
