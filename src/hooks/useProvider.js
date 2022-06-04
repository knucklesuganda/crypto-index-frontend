import { message } from "antd";
import { useState, useEffect } from "react";
import { connectWallet } from "../web3/wallet/providers";

export function useProvider() {
    const [providerData, setProviderData] = useState(null);

    const handleWalletConnection = (isInitial) => {

        return connectWallet(isInitial).then((providerData) => {
            setProviderData(providerData);
        }).catch((error) => {
            if(!isInitial){
                message.error(error);
            }
        });

    };

    useEffect(() => {
        if(!sessionStorage.isSent){
            console.log(1);
            sessionStorage.isSent = true;
            handleWalletConnection(true);
        }
    });
    return { providerData, handleWalletConnection };
}
