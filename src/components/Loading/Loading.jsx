import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./style.css";


export function Loading(props) {
    return <Spin style={props.style} indicator={<LoadingOutlined style={{ color: "white", fontSize: "3em" }} />} />;
}
