import { useState, useLayoutEffect } from "react";
import { Row, Col, Menu, Typography } from "antd";
import IndexAboutUs from "./IndexAboutUs";
import IndexStart from "./IndexStart";
import IndexBuyProducts from "./IndexBuyProducts/IndexBuyProducts";


export default function IndexPage(props) {
    const [currentPage, setCurrentPage] = useState(0);
    const startId = props.startId;
    const aboutUsId = "about-us";
    const buyProductsId = "buy-products";

    useLayoutEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = originalStyle);
    }, []);

    return (
        <Row style={{ paddingRight: "1em", paddingTop: "0.5em" }}>
            <Col span={22} style={{ display: 'flex', direction: "column" }}>
                <Row style={{ width: "100%" }}>
                    {[
                        <IndexStart id={startId} setNextPage={() => {
                            document.getElementById(aboutUsId).scrollIntoView({ behavior: "smooth" });
                            setCurrentPage(1);
                        }} />,
                        <IndexAboutUs id={aboutUsId} setNextPage={() => {
                            document.getElementById(buyProductsId).scrollIntoView({ behavior: "smooth" });
                            setCurrentPage(2);
                        }} />,
                        <IndexBuyProducts id={buyProductsId} account={props.account} />,
                    ].map((item, index) => <Col key={index} span={24} style={{ height: "100vh" }}>{item}</Col>)}
                </Row>
            </Col>

            <Col span={2}>
                <Menu selectedKeys={[currentPage.toString()]} mode="inline" style={{
                    background: "none", height: "100%", position: "fixed",
                }} onSelect={({ _, key }) => { setCurrentPage(parseInt(key)); }}>
                    <Menu.ItemGroup>
                        <Menu.Item key='0'>
                            <a href={`#${startId}`}>Start</a>
                        </Menu.Item>
                        <Menu.Item key='1'>
                            <a href={`#${aboutUsId}`}>About us</a>
                        </Menu.Item>
                        <Menu.Item key='2'>
                            <a href={`#${buyProductsId}`}>Buy Products</a>
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>

            </Col>
        </Row>
    );
}
