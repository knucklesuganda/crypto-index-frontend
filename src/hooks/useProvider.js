import { useState } from "react";
import { connectWallet } from "../web3/wallet/providers";

export function useProvider() {
    const [providerData, setProviderData] = useState(null);

    const handleWalletConnection = (provider) => {

        return connectWallet(provider).then((providerData) => {
            if(providerData !== null){
                setProviderData(providerData);
            }
        });

    };

    return { providerData, handleWalletConnection };
}
