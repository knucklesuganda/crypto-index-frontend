import { useCallback, useEffect, useState } from "react";
import { connectWallet } from "../web3/wallet/providers";

export function useProvider() {
    const [providerData, setProviderData] = useState(null);

    const handleWalletConnection = useCallback((isInitial) => {

        return connectWallet(isInitial).then((providerData) => {
            setProviderData(providerData);
        }).catch((error) => { if(!isInitial){ throw error; } });

    }, [providerData]);

    useEffect(() => {
        handleWalletConnection(true);
    }, []);

    return { providerData, handleWalletConnection };
}
