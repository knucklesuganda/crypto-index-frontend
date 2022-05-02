import { useState, useLayoutEffect } from "react";
import { Row, Col, Menu } from "antd";
import { IndexBiggestProblem } from "./IndexBiggestProblem";
import { IndexStart } from "./IndexStart";
import { IndexBuyProducts } from "./IndexBuyProducts/IndexBuyProducts";
import { useTranslation } from "react-i18next";


export default function IndexPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const startId = 'start';
    const aboutUsId = "about-us";
    const buyProductsId = "buy-products";
    const { t } = useTranslation();

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
                        <IndexBiggestProblem id={aboutUsId} isOpen={currentPage === 1} setNextPage={() => {
                            document.getElementById(buyProductsId).scrollIntoView({ behavior: "smooth" });
                            setCurrentPage(2);
                        }} />,
                        <IndexBuyProducts id={buyProductsId} setNextPage={() => {
                            document.getElementById(startId).scrollIntoView({ behavior: "smooth" });
                            setCurrentPage(0);
                        }}/>,
                    ].map((item, index) => <Col key={index} span={24} style={{ height: "100vh" }}>{item}</Col>)}
                </Row>
            </Col>

            <Col span={2} id="menu" >
                <Menu selectedKeys={[currentPage.toString()]} mode="inline" style={{
                    background: "none", height: "100%", position: "fixed",
                }} onSelect={({ _, key }) => { setCurrentPage(parseInt(key)); }}>
                    <Menu.ItemGroup>
                        <Menu.Item key='0'>
                            <a href={`#${startId}`}>{t('index.menu.start')}</a>
                        </Menu.Item>
                        <Menu.Item key='1'>
                            <a href={`#${aboutUsId}`}>{t('index.menu.about_us')}</a>
                        </Menu.Item>
                        <Menu.Item key='2'>
                            <a href={`#${buyProductsId}`}>{t('index.menu.buy_products')}</a>
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>

            </Col>
        </Row>
    );
}
