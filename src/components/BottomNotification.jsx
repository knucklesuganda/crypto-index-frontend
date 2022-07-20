import { Row, Col, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";


export function BottomNotification() {
    const [isVisible, setIsVisible] = useState(true);

    if(!isVisible || sessionStorage.bottomNotificationHidden){
        return null;
    }

    return <Row style={{
        display: "flex",
        bottom: 0,
        left: 0,
        position: "fixed",
        width: "100%",
        minHeight: "4em",
        background: "rgb(10, 10, 10)",
        borderTop: "1px solid #303030",
        boxShadow: "rgb(255 255 255 / 20%) 5px 5px 25px 0px",
        fontSize: "1.2em",
        fontWeight: "bolder",
        justifyContent: "center",
        alignItems: "center",
    }}>
        <Col span={23} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography.Text style={{ marginRight: "1em" }}>You need the Crypto Index!</Typography.Text>
            <Typography.Text className="bordered_button">Find out why</Typography.Text>
        </Col>

        <Col>
            <CloseOutlined style={{ cursor: "pointer" }} onClick={() => {
                setIsVisible(false);
                sessionStorage.bottomNotificationHidden = true;
            }} />
        </Col>
    </Row>;
}
