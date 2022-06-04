import { useCallback, useEffect, useState } from "react";
import { connectWallet } from "../web3/wallet/providers";

export function useProvider() {
    const [providerData, setProviderData] = useState(null);

    const handleWalletConnection = (isInitial) => {

        return connectWallet(isInitial).then((providerData) => {
            setProviderData(providerData);
        }).catch((error) => { if(!isInitial){ throw error; } });

    };

    useEffect(() => { handleWalletConnection(true); }, [handleWalletConnection]);

    return { providerData, handleWalletConnection };
}
