import { message } from 'antd';


export async function setupEvents(provider) {
    const { provider: ethereum } = provider;

    ethereum.on('accountsChanged', (accounts) => {
        message.info(`Account changed to: ${accounts[0]}`)
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

    provider.on("pending", (tx) => {
        message.info(`Transaction ${tx.hash} is pending`);
    });

}
