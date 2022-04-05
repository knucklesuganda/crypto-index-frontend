import { Col, Typography } from "antd";


export function Title(props) {
    return <Col span={24} style={{ paddingLeft: "1em", ...props.style }} id={props.id}>
        <Typography.Text style={{ color: "white!important", fontSize: "2em" }}>
            { props.children }
        </Typography.Text>
    </Col>;
}
