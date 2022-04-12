import { useCallback, useEffect, useState } from "react";
import { connectWallet } from "../web3/wallet/providers";


export function useProvider() {
    const [providerData, setProviderData] = useState(null);

    const handleWalletConnection = useCallback(() => {
        if (providerData !== null) {
            return;
        }

        connectWallet().then((providerData) => { setProviderData(providerData) });
    }, [providerData]);

    useEffect(() => {
        handleWalletConnection();
    }, [providerData, handleWalletConnection]);

    return { providerData, handleWalletConnection };
}
