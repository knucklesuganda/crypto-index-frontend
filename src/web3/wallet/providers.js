import Web3Modal, { getInjectedProvider } from "web3modal";
import { ethers } from "ethers";
import { setupEvents } from "./events";
import settings from "../../settings";


const providerOptions = {
    walletconnect: {
        package: window.WalletConnectProvider.default,
        options: { rpc: { 1: settings.PUBLIC_RPC_URL } },
    },
};

class NoProviderError extends Error { }
export class NoInitialProviderError extends Error { }


let signer = null, provider = null;
const web3Modal = new Web3Modal({

    cacheProvider: false,
    providerOptions,

    theme: {
        background: "#0a0a0a",
        main: "#ffffff",
        secondary: "#177ddc",
        border: "#fff",
        hover: "#272323"
    },
});


export async function connectWallet(isInitial) {

    let web3ModalProvider;

    try {

        if(sessionStorage.provider){
            web3ModalProvider = await web3Modal.connectTo(sessionStorage.provider);
        }else{

            if(isInitial === true){
                return null;
            }

            web3ModalProvider = await web3Modal.connect();
            sessionStorage.provider = getInjectedProvider()['id'];
        }

    } catch (error) {
        throw new NoProviderError(error);
    }

    provider = new ethers.providers.Web3Provider(web3ModalProvider);
    signer = provider.getSigner();
    sessionStorage.account = await _getWallet();
    setupEvents(provider);

    return { account: sessionStorage.account, signer, provider };
}


export function clearProvider(){
    sessionStorage.removeItem('provider');
}


export async function _getWallet() {
    return (await provider.listAccounts())[0];
}
