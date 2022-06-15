import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { setupEvents } from "./events";
import settings from "../../settings";


const providerOptions = {
    walletconnect: {
        package: window.WalletConnectProvider.default,
        options: { rpc: { 1: settings.PUBLIC_RPC_URL } },
    }
};

class NoProviderError extends Error { }
export class NoInitialProviderError extends Error { }


let signer = null, provider = null;
let web3Modal = new Web3Modal({

    cacheProvider: true,
    network: "mainnet",
    providerOptions,

    theme: {
        background: "#0a0a0a",
        main: "#ffffff",
        secondary: "#177ddc",
        border: "#a0a0a0",
        hover: "#272323"
    },
});


export async function connectWallet(initial) {

    let web3ModalProvider;

    try {
        console.log(initial === true, typeof web3Modal.cachedProvider === "string")

        if(initial === true && typeof web3Modal.cachedProvider === "string"){
            web3ModalProvider = await web3Modal.connectTo(web3Modal.cachedProvider);
        }else if(initial === true){
            throw new NoProviderError();
        }

        web3ModalProvider = await web3Modal.connect();
    } catch (error) {
        throw new NoProviderError(error);
    }

    provider = new ethers.providers.Web3Provider(web3ModalProvider);
    signer = provider.getSigner();

    sessionStorage.account = await _getWallet();
    setupEvents(provider);

    return { account: sessionStorage.account, signer, provider };
}


export async function clearProvider() {
    signer = null;
    provider = null;
    web3Modal.clearCachedProvider();
    localStorage.removeItem('walletconnect');
    sessionStorage.removeItem('account');
}


export async function _getWallet() {
    return (await provider.listAccounts())[0];
}
