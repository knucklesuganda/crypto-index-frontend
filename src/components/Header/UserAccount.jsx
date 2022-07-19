import { clearProvider, connectWallet } from "../../web3/wallet/providers";
import { Col, Row, Dropdown, Menu, Typography, message } from "antd";
import { changeNetwork } from "../../web3/wallet/functions";
import { useNetwork } from '../../hooks/useNetwork';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { EthereumLogo } from "./logos/EthereumLogo";
import settings from '../../settings';
import "./style.css";
import { PolygonLogo } from "./logos/PolygonLogo";


function NetworkLabel(props){
    return <Row style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
        <Typography.Text style={{ marginRight: "0.5em", fontSize: "1.2em" }}>{props.text}</Typography.Text>
        {props.icon}
    </Row>;
}


function NetworkPicker(props) {
    const { t } = useTranslation();
    const { network, provider } = useNetwork();

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
            if (provider === null) {
                return props.walletConnectHandler();
            }

            const networkId = parseInt(data.key);

            if (network.ID === networkId) {
                message.error(t("wallet.same_network"));
            } else {
                message.info(t("wallet.change_network"));

                changeNetwork(provider, networkId).catch(() => {
                    message.error(t("wallet.change_network"));
                });
            }
        }} />
    }>
        <Col className="user_account_button" style={{ marginRight: "1em" }}>
            <Typography.Text style={{ fontSize: "1.2em", paddingLeft: "0.5em", paddingRight: "0.5em" }}>
                {network ? network.NAME : null}
            </Typography.Text>
            <DownOutlined />
        </Col>
    </Dropdown>;
}


export function UserAccount() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { t } = useTranslation();

    const handleWalletConnection = () => {
        connectWallet().catch(() => {
            message.error(t("accept_wallet"));
        });
        message.info(t("accept_wallet"));
    };

    useEffect(() => {
        const accountConnected = (_) => { setIsLoggedIn(true); };
        window.addEventListener('account_connected', accountConnected, false);
        return () => { window.removeEventListener('account_connected', accountConnected); };
    }, [setIsLoggedIn]);

    return <Row>
        <NetworkPicker walletConnectHandler={() => { handleWalletConnection(); }} />

        <Col className="user_account_button" onClick={() => {
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