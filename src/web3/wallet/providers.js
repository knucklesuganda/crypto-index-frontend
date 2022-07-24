import { NetworkChanged, WalletConnected } from "./events";
import { ethers, providers } from "ethers";
import { setupEvents } from "./event_handlers";
import Web3Modal from "web3modal";
import settings from "../../settings";


const providerOptions = {
    walletconnect: {
        package: window.WalletConnectProvider.default,
        options: {
            rpc: {
                1: settings.NETWORKS.ETHEREUM.URLS,
                137: settings.NETWORKS.POLYGON.URLS,
            },
        },
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
        hover: "#272323",
    },
});


export async function connectWallet(initial) {
    if(signer !== null && provider !== null){
        window.dispatchEvent(new WalletConnected());
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

    window.dispatchEvent(new WalletConnected());
    window.dispatchEvent(new NetworkChanged());
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


async function _getWallet() {
    return (await provider.listAccounts())[0];
}


export function getDummyProvider(address){
    const provider = new providers.JsonRpcProvider();
    return { provider, signer: new ethers.VoidSigner(address, provider), account: null };
}
