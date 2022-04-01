import {Row, Col, Menu, Typography } from "antd";
import IndexStart from "./IndexStart";

export default function IndexPage(props) {
    return (
        <Row style={{paddingRight: "1em", paddingTop: "0.5em"}}>
            <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                <Typography.Title level={2}>
                    <a href="/">ZONA</a>
                </Typography.Title>
            </Col>

            <Col span={22}>
                <IndexStart />
            </Col>

            <Col span={2}>
                <Menu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline" 
                       style={{ background: "none", height: "100%", position: "fixed", }}>
                    <Menu.ItemGroup>
                        <Menu.Item key={1}>
                            <a href="#start">Start</a>
                        </Menu.Item>
                        <Menu.Item key={2}>
                            <a href="#aboutCompany">About us</a>
                        </Menu.Item>
                        <Menu.Item key={3}>
                            <a href="#buyProducts">Buy Products</a>
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
            </Col>
        </Row>
    );
}
