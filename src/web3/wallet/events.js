import { message, notification } from 'antd';


export async function setupEvents(provider) {
    const { provider: ethereum } = provider;

    ethereum.on('accountsChanged', (accounts) => {
        message.info(`Account changed to: ${accounts[0]}`);
        window.location.reload();
    });

    provider.on("network", (newNetwork, oldNetwork) => {
        message.info(`Network switched to ${newNetwork.name}`);

        // if (!process.env.DEBUG) {
        //     ethereum.request({
        //         method: 'wallet_switchEthereumChain',
        //         params: [{ chainId: process.env.CHAIN_ID }],
        //     });
        // }

    });

    console.log(provider.on("error", (error) => {
        let errorMessage = error ? error.data : null;

        if(errorMessage !== null){
            errorMessage = error.data.message;
        }else{
            errorMessage = "Unknown error";
        }

        notification.error(errorMessage)
    }));

    provider.on("pending", (tx) => {
        message.info(`Transaction ${tx.hash} is pending`);
    });

}
