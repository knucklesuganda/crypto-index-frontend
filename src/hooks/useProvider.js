import { useEffect, useState } from "react";
import { connectWallet } from "../web3/wallet/providers";
import { message } from "antd";


export function useProvider() {
    const [providerData, setProviderData] = useState(null);

    function handleWalletConnection() {
        if(providerData !== null){
            return;
        }

        connectWallet().then((providerData) => {
            setProviderData(providerData);
        }).catch((error) => {
            message.error({
                content: error ? error.message : "Unknown error",
                duration: 5,
            });
        });
    }

    useEffect(() => {
        if (providerData === null) {
            handleWalletConnection();
        }
    });
    return { providerData, handleWalletConnection };
}
