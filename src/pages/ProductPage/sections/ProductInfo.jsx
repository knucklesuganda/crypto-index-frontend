import { Avatar, Row, Typography, Card, Col } from "antd";
import { QuestionOutlined } from "@ant-design/icons";


export function ProductInfo(props) {
    // TODO: translatoin

    return <Col>
        <Typography.Title>Frequently asked questions</Typography.Title>

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

                    <Col>
                        <Typography.Text>{item.answer}</Typography.Text>
                    </Col>
                </Card>
            </Col>)}
        </Row>
    </Col>;
}
