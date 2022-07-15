import { getNetwork } from "../web3/wallet/functions";
import { connectWallet } from "../web3/wallet/providers";
import { useEffect, useState } from "react";


export function useNetwork() {
    const [network, setNetwork] = useState(null);
    const [provider, setProvider] = useState();

    useEffect(() => {
        connectWallet(true).then(({ provider }) => {
            setProvider(provider);

            provider.getNetwork().then(({ chainId }) => {
                setNetwork(getNetwork(chainId));
            });

        });
    }, [setProvider, setNetwork]);

    return { network, provider };
}
