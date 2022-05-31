import { message } from 'antd';
import settings from '../../settings';


export async function setupEvents(provider) {
    const { provider: ethereum } = provider;
    let networkChangeRequest = false;

    provider.on("error", (error) => {

        if(error.event === "changed" && !networkChangeRequest){
            networkChangeRequest = true;

            ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: settings.CHAIN_ID }],
            }).then(() => {
                networkChangeRequest = false;
            }).catch((error) => {
                networkChangeRequest = false;
                message.error(error.reason);
            });

        }else if(error.event !== "changed" && error.reason){
            message.error(error.reason);
        }

    });

    ethereum.on('accountsChanged', (accounts) => {
        message.info(`Account changed to: ${accounts[0]}`);
        window.location.reload();
    });

    provider.on("pending", (tx) => {
        message.info(`Transaction ${tx.hash} is pending`);
    });

}
