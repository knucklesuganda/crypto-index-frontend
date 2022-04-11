import { Col, Row, Typography } from "antd";
import { useEffect, useRef } from "react";
import { Zoom } from "react-reveal";


export default function NotFoundPage() {
    const errorMessages = [];

    for (let index = 0; index < 24; index++) {
        errorMessages.push(
            <Col span={4}>
                <Typography.Title key={index} level={4}>
                    <Zoom cascade collapse>Page was not found</Zoom>
                </Typography.Title>
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
