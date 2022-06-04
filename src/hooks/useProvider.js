import { useState, useEffect } from "react";
import { connectWallet } from "../web3/wallet/providers";

export function useProvider() {
    const [providerData, setProviderData] = useState(null);

    const handleWalletConnection = (isInitial) => {

        return connectWallet(isInitial).then((providerData) => {
            if(providerData !== null){
                setProviderData(providerData);
            }
        });

    };

    useEffect(() => {
        handleWalletConnection(true);
    }, []);

    return { providerData, handleWalletConnection };
}
