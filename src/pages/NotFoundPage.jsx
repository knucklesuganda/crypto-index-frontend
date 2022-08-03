import { useEffect } from "react";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { Fade } from "../components/animations";


export default function NotFoundPage() {
    const errorMessages = [];
    const { t } = useTranslation();

    useEffect(() => {
        document.body.className = "";
        return () => {};
    });

    for (let index = 0; index < 24; index++) {
        errorMessages.push(
            <Col span={4} key={index}>
                <Fade duration={Math.random() * 5000 + 1000} isActive>
                    <Typography.Title key={index} level={4}>{t('not_found')}</Typography.Title>
                </Fade>
            </Col>
        );
    }

    return <Row style={{
        paddingLeft: "1em",
        height: "90vh",
        display: "flex",
        alignItems: "center",
    }}>{errorMessages}</Row>;
}
