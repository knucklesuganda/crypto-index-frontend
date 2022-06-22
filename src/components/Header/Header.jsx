import { Fragment, useEffect, useState } from "react";
import { Title } from "../Title";
import { Col, Row } from "antd";
import { UserAgreement } from "..";
import { INDEX_PAGE } from "../../routes";
import { Divider, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { MobileOnly, OnlyDesktop } from "../MediaQuery";
import { TranslationOutlined, YoutubeOutlined, TwitterOutlined } from '@ant-design/icons';
import { clearProvider } from "../../web3/wallet/providers";
import { DiscordLogo } from "./DiscordLogo";
import "./style.css";


function UserAccount() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        window.addEventListener('account_connected', (_) => {
            setIsLoggedIn(true);
        }, false);

        return () => { window.removeEventListener("account_connected"); };
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


export function Header(props) {
    const { t, i18n } = useTranslation();

    return <Fragment>
        <Row id="header_row">
            <Col>
                <Title id='start'>
                    <a href={INDEX_PAGE} style={{ color: "white" }}>{t('title')}</a>
                </Title>
            </Col>

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

        {props.children}
    </Fragment>;
}
