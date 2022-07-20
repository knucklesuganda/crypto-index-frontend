import { useLocation, useNavigate } from "react-router";
import { getNetwork } from "../web3/wallet/functions";
import { connectWallet } from "../web3/wallet/providers";
import { useEffect, useState } from "react";
import settings from "../settings";


function getChainParameter(){
    const searchParams = new URLSearchParams(window.location.search);
    return parseInt(searchParams.get('chain'));
}


export function useNetwork() {
    const [network, setNetwork] = useState(settings.NETWORKS.ETHEREUM);
    const [provider, setProvider] = useState(null);
    const navigate = useNavigate();

    function changeNetworkParam(chainId){
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("chain", chainId);
        window.dispatchEvent(new Event("network_changed"));
        navigate({ pathname: window.location.pathname, search: searchParams.toString() }, { replace: true });
    }

    const networkChangeEvent = () => {
        connectWallet(true).then(({ provider }) => {
            setProvider(provider);

            provider.getNetwork().then(({ chainId }) => {
                const chainParameter = getChainParameter();

                if(chainId !== chainParameter){
                    changeNetworkParam(chainId);
                }

                setNetwork(getNetwork(chainId));
            });

        }).catch(() => {});
    };

    useEffect(() => {
        let chainParameter = getChainParameter();

        if(isNaN(chainParameter)){
            chainParameter = settings.NETWORKS.ETHEREUM.ID;
            changeNetworkParam(chainParameter);
        }

        const networkData = getNetwork(chainParameter);
        setNetwork(networkData);

        window.addEventListener("network_changed", networkChangeEvent);
        networkChangeEvent();

        return () => { window.removeEventListener("network_changed", networkChangeEvent); }
    }, [window.location.search, provider]);

    return { network, provider, changeNetworkParam };
}
