import { Col, Typography } from "antd";
import { useMobileQuery } from "./MediaQuery";


export function Title(props) {
    const isMobile = useMobileQuery();

    return <Col span={24} style={{
        paddingLeft: isMobile ? "0" : "1em",
        display: "flex",
        justifyContent: isMobile ? "center" : "inherit",
        ...props.style,
    }}>
        <Typography.Text style={{ color: "white", fontSize: "2em" }}>
            {props.children}
        </Typography.Text>
    </Col>;
}
