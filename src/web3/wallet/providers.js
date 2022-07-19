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
export class NoInitialProviderError extends NoProviderError { }
export class NotConnectedError extends Error { }


let signer = null, provider = null;
let web3Modal = new Web3Modal({

    cacheProvider: true,
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
    if(signer && provider){
        return { account: sessionStorage.account, signer, provider };
    }

    let web3ModalProvider;

    if (initial === true && (typeof web3Modal.cachedProvider !== "string" || !web3Modal.cachedProvider)) {
        throw new NoProviderError();
    } else if (initial === true) {
        try {
            web3ModalProvider = await web3Modal.connectTo(web3Modal.cachedProvider);
        } catch (error) {
            throw new NotConnectedError(error.message);
        }
    } else {
        web3ModalProvider = await web3Modal.connect();
    }

    provider = new ethers.providers.Web3Provider(web3ModalProvider, "any");
    signer = provider.getSigner();
    sessionStorage.account = await _getWallet();

    window.dispatchEvent(new Event("account_connected"));
    window.dispatchEvent(new Event("network_changed"));
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
