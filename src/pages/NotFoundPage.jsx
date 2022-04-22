import { Col, Row, Typography } from "antd";
import { Fade } from "../components/animations";


export default function NotFoundPage() {
    const errorMessages = [];

    for (let index = 0; index < 24; index++) {
        errorMessages.push(
            <Col span={4} key={index}>
                <Fade duration={Math.random() * 5000 + 1000} isActive>
                    <Typography.Title key={index} level={4}>Page was not found</Typography.Title>
                </Fade>
            </Col>
        );
    }

    return <Row style={{
        paddingLeft: "1em",
        height: "90vh",
        display: "flex",
        alignItems: "center"
    }}>{errorMessages}</Row>;
}
