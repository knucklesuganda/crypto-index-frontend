import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { setupEvents } from "./events";
import settings from "../../settings";


const providerOptions = {
    walletconnect: {
        package: window.WalletConnectProvider.default,
        options: { rpc: { 1337: settings.PUBLIC_RPC_URL } },
    },
};

class NoProviderError extends Error { }


let signer = null, provider = null;
const web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,

    theme: {
        background: "#141414",
        main: "#ffffff",
        secondary: "#177ddc",
        border: "#303030",
        hover: "#272323"
    }
});


export async function connectWallet() {
    if (provider !== null && signer !== null) {
        return { account: await _getWallet(), signer, provider };
    }

    let web3ModalProvider;

    try {
        console.log(web3Modal);
        web3ModalProvider = await web3Modal.connect();
    } catch (erorr) {
        throw new NoProviderError();
    }

    provider = new ethers.providers.Web3Provider(web3ModalProvider);
    signer = provider.getSigner();
    setupEvents(provider);

    return { account: await _getWallet(), signer, provider };
}


export async function _getWallet() {
    return (await provider.listAccounts())[0];
}
