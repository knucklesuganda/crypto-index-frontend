import { useState, useEffect } from "react";
import { connectWallet } from "../web3/wallet/providers";

export function useProvider() {
    const [providerData, setProviderData] = useState(null);

    const handleWalletConnection = (initial) => {

        return connectWallet(initial).then((providerData) => {
            if(providerData !== null){
                setProviderData(providerData);
            }
        });

    };

    useEffect(() => {
        handleWalletConnection(true).catch((err) => {
            console.log(err);
        });
        return () => {};
    }, []);

    return { providerData, handleWalletConnection };
}
