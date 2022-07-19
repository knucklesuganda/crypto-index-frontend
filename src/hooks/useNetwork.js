import { getNetwork } from "../web3/wallet/functions";
import { connectWallet } from "../web3/wallet/providers";
import { useEffect, useState } from "react";
import settings from "../settings";


export function useNetwork() {
    const [network, setNetwork] = useState(settings.NETWORKS.ETHEREUM);
    const [provider, setProvider] = useState(null);

    const networkChangeEvent = () => {
        connectWallet(true).then(({ provider }) => {
            setProvider(provider);

            provider.getNetwork().then(({ chainId }) => {
                setNetwork(getNetwork(chainId));
            });

        }).catch(() => {});
    };

    useEffect(() => {
        window.addEventListener("network_changed", networkChangeEvent);
        networkChangeEvent();
        return () => { window.removeEventListener("network_changed", networkChangeEvent); }
    });

    return { network, provider };
}
