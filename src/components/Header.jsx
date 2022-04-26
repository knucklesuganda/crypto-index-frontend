import { Fragment } from "react";
import { INDEX_PAGE } from "../routes";
import { Title } from "./Title";
import { useTranslation } from "react-i18next";
import { Col, Row, Typography } from "antd";
import { TranslationOutlined } from '@ant-design/icons';
import { Fade } from "./animations";


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

            <Col style={{ display: "flex", alignItems: "flex-end", cursor: "pointer" }}
                onClick={() => {
                    if (i18n.language === "en") {
                        i18n.changeLanguage("ru");
                    } else {
                        i18n.changeLanguage("en");
                    }
                }}>
                    <Fade isActive>
                        <Typography.Text style={{ fontSize: "1.5em", paddingRight: '0.2em' }}>
                            {i18n.language}
                        </Typography.Text>

                        <TranslationOutlined style={{ fontSize: "2.2em" }} />
                    </Fade>
            </Col>
        </Row>

        {props.children}
    </Fragment>;
}
