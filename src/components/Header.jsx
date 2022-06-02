import { Fragment } from "react";
import { INDEX_PAGE } from "../routes";
import { Title } from "./Title";
import { useTranslation } from "react-i18next";
import { Col, Row, Typography } from "antd";
import { TranslationOutlined } from '@ant-design/icons';
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
                <UserAgreement />

                <Fade isActive>
                    <Col style={{ marginRight: "1em" }}>{
                        sessionStorage.getItem('account') === null ? null :
                            <Typography.Text style={{cursor: "pointer", fontSize: "1.2em"}} title={sessionStorage.account}>
                                {sessionStorage.account.slice(0, 20)}...
                            </Typography.Text>
                    }</Col>

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
