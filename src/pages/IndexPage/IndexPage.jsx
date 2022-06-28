import { IndexStart } from "./IndexStart";
import { Row, Col, Menu, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { IndexPreview } from "./IndexPreview/IndexPreview";
import { IndexBuyProducts } from "./IndexBuyProducts/IndexBuyProducts";
import { OnlyDesktop, useDesktopQuery } from "../../components/MediaQuery";
import { useVisibility } from "../../hooks";


export default function IndexPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const startId = 'start';
    const previewId = "preview";
    const buyProductsId = "buy-products";

    const { t } = useTranslation();
    const isDesktop = useDesktopQuery();
    const isTransition = useRef(false);

    const indexStartRef = useRef(null);
    const previewsRef = useRef(null);
    const buyProductsRef = useRef(null);

    const isIndexStartVisible = useVisibility(indexStartRef);
    const isPreviewsVisible = useVisibility(previewsRef);
    const isBuyProductsVisible = useVisibility(buyProductsRef);    

    const sectionRefs = [indexStartRef, previewsRef, buyProductsRef];
    const visibilities = [isIndexStartVisible, isPreviewsVisible, isBuyProductsVisible];

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
                            scrollIntoComponent(previewId, 1);
                        }} />,

                        <IndexPreview id={previewId} isOpen={currentPage === 1} setNextPage={() => {
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
                                <a href={`#${previewId}`}>{t('index.menu.preview')}</a>
                            </Menu.Item>

                            <Menu.Item key='2'>
                                <a href={`#${buyProductsId}`} style={{ color: "lime", fontWeight: "bold" }}>
                                    {t('index.menu.buy_products')}
                                </a>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu>
                </Col>
            </OnlyDesktop>
        </Row>
    );
}
