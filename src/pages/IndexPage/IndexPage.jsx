import { useState, useRef, useEffect } from "react";
import { Row, Col, Menu, Divider } from "antd";
import { IndexBiggestProblem } from "./IndexBiggestProblem";
import { IndexStart } from "./IndexStart";
import { IndexBuyProducts } from "./IndexBuyProducts/IndexBuyProducts";
import { useTranslation } from "react-i18next";
import { OnlyDesktop, useDesktopQuery } from "../../components/MediaQuery";
import useVisibility from "../../hooks/useVisibility";


export default function IndexPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const startId = 'start';
    const biggestProblemsId = "about-us";
    const buyProductsId = "buy-products";

    const { t } = useTranslation();
    const isDesktop = useDesktopQuery();
    const isTransition = useRef(false);

    const indexStartRef = useRef(null);
    const biggestProblemsRef = useRef(null);
    const buyProductsRef = useRef(null);

    const isIndexStartVisible = useVisibility(indexStartRef);
    const isBiggestProblemsVisible = useVisibility(biggestProblemsRef);
    const isBuyProductsVisible = useVisibility(buyProductsRef);    

    const sectionRefs = [indexStartRef, biggestProblemsRef, buyProductsRef];
    const visibilities = [isIndexStartVisible, isBiggestProblemsVisible, isBuyProductsVisible];

    const scrollIntoComponent = (componentId, page) => {
        document.getElementById(componentId).scrollIntoView({ behavior: "smooth",  block: 'nearest', });
        setCurrentPage(page);
        setTimeout(() => { isTransition.current = false; }, 500);
    };

    const handleMenu = () => {
        visibilities.forEach((isVisible, index) => {

            if(isVisible){
                setCurrentPage(index);
            }

        });
    };

    useEffect(() => {
        handleMenu();
        return () => {};
    });

    return (
        <Row style={{
            paddingRight: isDesktop ? "1em" : "0",
            justifyContent: isDesktop ? "inherit" : "center",
            paddingTop: "0.5em",
        }} onWheel={handleMenu}>
            <Col span={22} style={{ display: 'flex', direction: "column" }}>
                <Row style={{ width: "100%" }}>
                    {[
                        <IndexStart id={startId} setNextPage={() => {
                            scrollIntoComponent(biggestProblemsId, 1);
                        }} />,

                        <IndexBiggestProblem id={biggestProblemsId} isOpen={currentPage === 1} setNextPage={() => {
                            scrollIntoComponent(buyProductsId, 2);
                        }} />,

                        <IndexBuyProducts id={buyProductsId} setNextPage={() => {
                            scrollIntoComponent(startId, 0);
                        }} />,

                    ].map((item, index) => <Col ref={sectionRefs[index]} key={index} span={24} style={{
                        height: isDesktop ? "100vh" : "inherit",
                        marginBottom: isDesktop ? "5em" : "inherit"
                    }}>{isDesktop || index === 0 ? null : <Divider />} {item}</Col>)}
                </Row>
            </Col>

            <OnlyDesktop>
                <Col span={2} id="menu" >
                    <Menu selectedKeys={[currentPage.toString()]} mode="inline" style={{
                        background: "none", position: "fixed",
                    }} onSelect={({ _, key }) => { setCurrentPage(parseInt(key)); }}>
                        <Menu.ItemGroup>
                            <Menu.Item key='0'>
                                <a href={`#${startId}`}>{t('index.menu.start')}</a>
                            </Menu.Item>

                            <Menu.Item key='1'>
                                <a href={`#${biggestProblemsId}`}>{t('index.menu.about_us')}</a>
                            </Menu.Item>

                            <Menu.Item key='2'>
                                <a href={`#${buyProductsId}`}>{t('index.menu.buy_products')}</a>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu>
                </Col>
            </OnlyDesktop>
        </Row>
    );
}
