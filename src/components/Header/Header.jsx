import { TranslationOutlined, YoutubeOutlined, TwitterOutlined, DownOutlined } from '@ant-design/icons';
import { Col, Row, Dropdown, Menu, Divider, Typography, Button, message } from "antd";
import { changeNetwork } from "../../web3/wallet/functions";
import { clearProvider } from "../../web3/wallet/providers";
import { MobileOnly, OnlyDesktop } from "../MediaQuery";
import { Fragment, useEffect, useState } from "react";
import { useNetwork } from '../../hooks/useNetwork';
import { useTranslation } from "react-i18next";
import { DiscordLogo } from "./DiscordLogo";
import { useNavigate } from "react-router";
import { INDEX_PAGE } from "../../routes";
import settings from '../../settings';
import { UserAgreement } from "..";
import { Title } from "../Title";
import "./style.css";


function UserAccount() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const accountConnected = (_) => { setIsLoggedIn(true); };
        window.addEventListener('account_connected', accountConnected, false);

        return () => { window.removeEventListener('account_connected', accountConnected); };
    }, [setIsLoggedIn]);

    if (!isLoggedIn) {
        return <span />;
    }

    const text = `${t("logout")} ${sessionStorage.account.slice(0, 15)}...`;

    return <Col style={{
        cursor: "pointer",
        padding: "0.5em",
        background: "#0a0a0a",
        border: "1px solid #303030",
        borderRadius: "4px",
    }} onClick={() => {
        clearProvider();
        window.location.reload();
    }}>
        <Typography.Text style={{ fontSize: "1.2em" }}>{text}</Typography.Text>
    </Col>;
}


export function Header() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { network, provider } = useNetwork();

    return <Fragment>
        <Row id="header_row">
            <Col>
                <Title id='start'>
                    <span onClick={() => { navigate(INDEX_PAGE) }} style={{ color: "white" }}>
                        {t('title')}
                    </span>
                </Title>
            </Col>

            { provider ?
            <Col id="network_choice">
                <Dropdown placement="bottom" trigger={['click']} overlay={
                    <Menu items={[
                        { label: settings.NETWORKS.ETHEREUM.NAME, key: settings.NETWORKS.ETHEREUM.ID },
                        { label: settings.NETWORKS.POLYGON.NAME, key: settings.NETWORKS.POLYGON.ID },
                    ]} onClick={(data) => {
                        const networkId = parseInt(data.key);

                        if(network.ID === networkId){
                            message.error(t("wallet.same_network"));
                        }else{
                            message.info(t("wallet.change_network"));
                            changeNetwork(provider, networkId).catch(() => {
                                message.info(t("wallet.change_network"));
                            });
                        }
                    }} />
                }>
                    <Button style={{ border: "none", background: "none", paddingTop: 0 }}>
                        <Typography.Text style={{ fontSize: "1.2em", paddingLeft: "0.5em", paddingRight: "0.5em"}}>
                            {network ? network.NAME : null}
                        </Typography.Text>

                        <DownOutlined />
                    </Button>
                </Dropdown>
            </Col> : null }

            <Col id="header_links">
                <OnlyDesktop>
                    <div style={{ marginRight: "1em" }}>
                        <UserAccount />
                    </div>
                </OnlyDesktop>

                <div style={{ marginRight: "1em" }}>
                    <a href="https://twitter.com/ManagementVoid" style={{ color: "white", marginRight: "1em" }}>
                        <TwitterOutlined style={{ color: "white", fontSize: "2em" }} />
                    </a>

                    <a href="https://discord.gg/yFBacu7TFu" style={{ color: "white", marginRight: "1em" }}>
                        <DiscordLogo />
                    </a>

                    <a href="https://www.youtube.com/channel/UC40nmrHSeBgJuIx8BNeLWKA">
                        <YoutubeOutlined style={{ color: "white", fontSize: "2em" }} />
                    </a>
                </div>

                <UserAgreement style={{ marginRight: "1em" }} />

                <TranslationOutlined onClick={() => {
                    if (i18n.language === "en") {
                        i18n.changeLanguage("ru");
                    } else {
                        i18n.changeLanguage("en");
                    }
                }} style={{ fontSize: "2.2em" }} />
            </Col>

            <MobileOnly>
                <div style={{ marginTop: "0.4em" }}>
                    <UserAccount />
                </div>
            </MobileOnly>
        </Row>

        <MobileOnly><Divider /></MobileOnly>
    </Fragment>;
}
