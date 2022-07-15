import { message } from 'antd';


export async function setupEvents(provider) {
    const { provider: ethereum } = provider;

    provider.on("error", (error) => {
        if (error.event !== "changed" && error.reason) {
            message.error(error.message);
        }
        console.log(error);
    });

    ethereum.on("disconnect", () => {
        window.location.reload();
    })

    ethereum.on('chainChanged', () => {
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
