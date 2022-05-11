import Web3Modal, { getInjectedProvider, getInjectedProviderName } from "web3modal";
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


export async function connectWallet(isInitial) {

    let web3ModalProvider;

    try {

        if(sessionStorage.provider){
            web3ModalProvider = await web3Modal.connectTo(sessionStorage.provider);
        }else{

            if(isInitial){
                throw new Error("No cached provider found for the initial connection");
            }

            web3ModalProvider = await web3Modal.connect();
            sessionStorage.provider = getInjectedProvider()['id'];
        }

    } catch (error) {
        throw new NoProviderError(error);
    }

    provider = new ethers.providers.Web3Provider(web3ModalProvider);
    signer = provider.getSigner();
    setupEvents(provider);

    return { account: await _getWallet(), signer, provider };
}


export function clearProvider(){
    sessionStorage.removeItem('provider');
}


export async function _getWallet() {
    return (await provider.listAccounts())[0];
}
