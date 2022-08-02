import { changeNetwork, getNetwork } from "../web3/wallet/functions";
import { NetworkChanged, connectWallet } from "../web3/wallet";
import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import settings from "../settings";
import { message } from "antd";


export function getChainParameter(){
    const searchParams = new URLSearchParams(window.location.search);
    return parseInt(searchParams.get('chain'));
}


export function useNetwork() {
    const [network, setNetwork] = useState(getNetwork(getChainParameter()));
    const navigate = useNavigate();

    const changeNetworkParam = useCallback((chainId) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("chain", chainId);
        window.dispatchEvent(new NetworkChanged());
        navigate({ pathname: window.location.pathname, search: searchParams.toString() }, { replace: true });
    }, [navigate]);

    const networkChangeEvent = useCallback(() => {

        connectWallet(true).then(({ provider }) => {
            provider.getNetwork().then(({ chainId }) => {

                const chainParameter = getChainParameter();

                if(chainId !== chainParameter){
                    changeNetwork(provider, chainParameter).catch((error) => {message.error(error.message)});
                    chainId = chainParameter;
                }

                setNetwork(getNetwork(chainId));
            });
        }).catch(() => {
            const chainParameter = getChainParameter();
            setNetwork(getNetwork(chainParameter));
        });

    }, []);

    useEffect(() => {
        let chainParameter = getChainParameter();

        if(isNaN(chainParameter)){
            chainParameter = settings.NETWORKS.ETHEREUM.ID;
            changeNetworkParam(chainParameter);
        }

        setNetwork(getNetwork(chainParameter));
        window.addEventListener((new NetworkChanged()).type, networkChangeEvent);
        networkChangeEvent();

        return () => { window.removeEventListener((new NetworkChanged()).type, networkChangeEvent); }
    }, [changeNetworkParam, networkChangeEvent]);

    return { network, changeNetworkParam };
}
