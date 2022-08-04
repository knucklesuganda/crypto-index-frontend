import { getChainParameter } from "../hooks/useNetwork";
import { Col, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useMobileQuery } from "./MediaQuery";
import { useEffect, useState } from "react";
import { NetworkChanged } from "../web3/wallet";


export function NetworkOverlay(props){
    const { wantedNetwork, changeNetwork, children, currentNetworkId } = props;
    const [isNetworkCorrect, setIsNetworkCorrect] = useState(false);
    const isMobile = useMobileQuery();
    const { t } = useTranslation();

    useEffect(() => {
        if (getChainParameter() !== wantedNetwork.ID) {
            message.info(t("wallet.change_network"));
            changeNetwork(wantedNetwork.ID);
        }

        const networkChangeCallback = () => { setIsNetworkCorrect(!isNetworkCorrect); };
        window.addEventListener((new NetworkChanged()).type, networkChangeCallback);

        return () => { window.removeEventListener((new NetworkChanged()).type, networkChangeCallback) };
    }, [t, changeNetwork, wantedNetwork.ID, isNetworkCorrect]);

    if(currentNetworkId === null || currentNetworkId === wantedNetwork.ID){
        return children;
    }

    return <Col style={{
        display: "flex",
        placeItems: "center",
        flexDirection: "column",
        fontSize: "3em",
        textAlign: "center",
    }}>
        {t("wallet.change_network_to")} {wantedNetwork.NAME}

        <Button onClick={() => {
            message.info(t("wallet.change_network"));
            changeNetwork();
        }} style={{ maxWidth: isMobile ? "inherit" : "20em" }}>{t("wallet.change_network")}</Button>
    </Col>;
}
