import { Fragment } from "react";
import { INDEX_PAGE } from "../../routes";
import { Title } from "../Title";
import { useTranslation } from "react-i18next";
import { Col, Row } from "antd";
import { TranslationOutlined, TwitterOutlined } from '@ant-design/icons';
import { Fade } from "../animations";
import { UserAgreement } from "..";
import { Divider } from "antd";
import "./style.css";
import { MobileOnly } from "../MediaQuery";


export function Header(props) {
    const { t, i18n } = useTranslation();

    return <Fragment>
        <Row id="header_row">
            <Col>
                <Title id='start'><a href={INDEX_PAGE} style={{ color: "white" }}>{t('title')}</a></Title>
            </Col>

            <Col id="header_links">
                <a href="https://twitter.com/ManagementVoid" style={{ color: "white" }}>
                    <TwitterOutlined style={{ color: "white", fontSize: "2em", marginRight: "0.5em" }} />
                </a>

                <UserAgreement style={{ marginRight: "1em" }} />

                <Fade isActive>
                    <TranslationOutlined onClick={() => {
                        if (i18n.language === "en") {
                            i18n.changeLanguage("ru");
                        } else {
                            i18n.changeLanguage("en");
                        }
                    }} style={{ fontSize: "2.2em" }} />
                </Fade>
            </Col>
        </Row>

        <MobileOnly><Divider /></MobileOnly>

        {props.children}
    </Fragment>;
}
