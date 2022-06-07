import { message } from 'antd';
import settings from '../../settings';


let networkChangeRequest;


function switchChain(ethereum){

    ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: settings.CHAIN_ID }],
    }).then(() => {
        networkChangeRequest = false;
    }).catch((error) => {
        networkChangeRequest = false;
        message.error(error.reason);
    });

}


export async function setupEvents(provider) {
    const { provider: ethereum } = provider;

    provider.on("error", (error) => {

        if (error.event === "changed" && !networkChangeRequest) {
            networkChangeRequest = true;
            switchChain(ethereum);
        } else if (error.event !== "changed" && error.reason) {
            message.error(error.reason);
        }

    });

    ethereum.on("disconnect", () => {
        window.location.reload();
    })

    ethereum.on('chainChanged', () => {
        switchChain(ethereum);
        window.location.reload();
    });

    ethereum.on('accountsChanged', (accounts) => {
        message.info(`Account changed to: ${accounts[0]}`);
        window.location.reload();
    });

    ethereum.on("pending", (tx) => {
        message.info(`Transaction ${tx.hash} is pending`);
    });

}
