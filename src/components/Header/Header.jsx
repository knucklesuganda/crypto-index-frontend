import { TranslationOutlined, YoutubeOutlined, TwitterOutlined } from '@ant-design/icons';
import { OnlyMobile, OnlyDesktop } from "../MediaQuery";
import { useTranslation } from "react-i18next";
import { DiscordLogo } from "./logos/DiscordLogo";
import { UserAccount } from './UserAccount';
import { useNavigate } from "react-router";
import { UserAgreement, Title } from "..";
import { INDEX_PAGE } from "../../routes";
import { Col, Row, Divider } from "antd";
import { Fragment } from "react";
import "./style.css";


export function Header() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    return <Fragment>
        <Row id="header_row">
            <Col>
                <Title id='start'>
                    <span onClick={() => { navigate(INDEX_PAGE) }} style={{ color: "white", cursor: "pointer" }}>
                        {t('title')}
                    </span>
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

            <OnlyMobile>
                <div style={{ marginTop: "0.4em" }}>
                    <UserAccount />
                </div>
            </OnlyMobile>
        </Row>

        <OnlyMobile><Divider /></OnlyMobile>
    </Fragment>;
}
