import { Fragment } from "react";
import { INDEX_PAGE } from "../routes";
import { Title } from "./Title";
import { useTranslation } from "react-i18next";
import { Col, Row } from "antd";
import { TranslationOutlined, TwitterOutlined } from '@ant-design/icons';
import { Fade } from "./animations";
import { UserAgreement } from ".";


export function Header(props) {
    const { t, i18n } = useTranslation();

    return <Fragment>
        <Row style={{
            display: "flex", width: "100%", flexDirection: "row",
            justifyContent: "space-between", alignItems: "flex-end",
            paddingRight: "1em",
        }}>
            <Col>
                <Title id={props.id}>
                    <a href={INDEX_PAGE} style={{ color: "white" }}>{t('title')}</a>
                </Title>
            </Col>

            <Col style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <a href="https://twitter.com/ManagementVoid" style={{ color: "white!important" }}>
                    <TwitterOutlined style={{ fontSize: "2em", marginRight: "0.5em" }} />
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

        {props.children}
    </Fragment>;
}
