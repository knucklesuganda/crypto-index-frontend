import { Avatar, Row, Typography, Card, Col } from "antd";
import { QuestionOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useMobileQuery } from "../../../components/MediaQuery";


export function ProductInfo(props) {
    const { t } = useTranslation();
    const isMobile = useMobileQuery();

    return <Col style={{ marginTop: isMobile ? "2em" : "0" }}>
        <Typography.Title style={{ display: "flex", placeContent: "center", marginTop: "1em" }}>
            {t('product_info.title')}
        </Typography.Title>

        <Row>
            {props.data.map((item, index) => <Col key={index} span={12}>
                <Card style={{ background: "none", height: "100%", borderRadius: 0 }}>
                    <Row style={{ padding: 0, display: "flex", alignItems: "center" }}>
                        <Avatar icon={<QuestionOutlined style={{ fontSize: "1.2em" }} />} />

                        <Typography.Text style={{
                            paddingLeft: "0.5em",
                            fontWeight: "bold",
                            fontSize: "1.2em",
                        }}>{item.question}</Typography.Text>
                    </Row>

                    <Col><Typography.Text>{item.answer}</Typography.Text></Col>
                </Card>
            </Col>)}
        </Row>
    </Col>;
}
