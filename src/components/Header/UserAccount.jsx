import { clearProvider, connectWallet } from "../../web3/wallet/providers";
import { Col, Row, Dropdown, Menu, Typography, message } from "antd";
import { changeNetwork } from "../../web3/wallet/functions";
import { useNetwork } from '../../hooks/useNetwork';
import { EthereumLogo } from "./logos/EthereumLogo";
import { PolygonLogo } from "./logos/PolygonLogo";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import settings from '../../settings';
import "./style.css";


function NetworkLabel(props) {
    return <Row style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
        <Typography.Text style={{ marginRight: "0.5em", fontSize: "1.2em" }}>{props.text}</Typography.Text>
        {props.icon}
    </Row>;
}


function NetworkPicker() {
    const { t } = useTranslation();
    const { network, provider, changeNetworkParam } = useNetwork();

    return <Dropdown placement="bottom" trigger={['click']} overlay={
        <Menu items={[
            {
                label: <NetworkLabel text={settings.NETWORKS.ETHEREUM.NAME} icon={<EthereumLogo />} />,
                key: settings.NETWORKS.ETHEREUM.ID,
            },
            { type: "divider" },
            {
                label: <NetworkLabel text={settings.NETWORKS.POLYGON.NAME} icon={<PolygonLogo />} />,
                key: settings.NETWORKS.POLYGON.ID,
            },
        ]} onClick={(data) => {
            const networkId = parseInt(data.key);

            if (network.ID === networkId) {
                message.error(t("wallet.same_network"));
            } else if (!provider) {
                changeNetworkParam(data.key);
            } else {
                message.info(t("wallet.change_network"));

                changeNetwork(provider, networkId).catch(() => {
                    message.error(t("wallet.change_network"));
                });
            }

        }} />
    }>
        <Col className="bordered_button" style={{ marginRight: "1em" }}>
            <NetworkLabel text={network.NAME} icon={network.ID === 1 ? <EthereumLogo /> : <PolygonLogo />} />
        </Col>
    </Dropdown>;
}


export function UserAccount() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { t } = useTranslation();

    const handleWalletConnection = () => {
        connectWallet().catch(() => { message.error(t("accept_wallet")); });
    };

    useEffect(() => {
        const accountConnected = (_) => { setIsLoggedIn(true); };
        window.addEventListener('account_connected', accountConnected, false);
        return () => { window.removeEventListener('account_connected', accountConnected); };
    }, [setIsLoggedIn]);

    return <Row>
        <NetworkPicker />

        <Col className="bordered_button" onClick={() => {
            if (isLoggedIn) {
                clearProvider();
                window.location.reload();
            } else {
                handleWalletConnection();
            }
        }}>
            <Typography.Text style={{ fontSize: "1.2em" }}>
                {isLoggedIn ? `${t("logout")} ${sessionStorage.account.slice(0, 15)}...` : 'Connect wallet'}
            </Typography.Text>
        </Col>
    </Row>;
}