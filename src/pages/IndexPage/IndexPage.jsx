import { useState, useLayoutEffect, useRef } from "react";
import { Row, Col, Menu, Divider } from "antd";
import { IndexBiggestProblem } from "./IndexBiggestProblem";
import { IndexStart } from "./IndexStart";
import { IndexBuyProducts } from "./IndexBuyProducts/IndexBuyProducts";
import { useTranslation } from "react-i18next";
import { OnlyDesktop, useDesktopQuery } from "../../components/MediaQuery";


export default function IndexPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const startId = 'start';
    const aboutUsId = "about-us";
    const buyProductsId = "buy-products";

    const { t } = useTranslation();
    const isDesktop = useDesktopQuery();
    const isTransition = useRef(false);

    useLayoutEffect(() => {
        if(isDesktop){
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = "hidden";
            return () => (document.body.style.overflow = originalStyle);
        }else{
            return () => {};
        }
    }, [isDesktop]);

    const scrollIntoComponent = (componentId, page) => {
        document.getElementById(componentId).scrollIntoView({ behavior: "smooth" });
        setCurrentPage(page);
        setTimeout(() => { isTransition.current = false; }, 500);
    };

    return (
        <Row style={{
            paddingRight: isDesktop ? "1em" : "0",
            justifyContent: isDesktop ? "inherit" : "center",
            paddingTop: "0.5em",
        }} onWheel={(event) => {
            if(isTransition.current || !isDesktop){
                return;
            }

            let newPageId, newPageNum;

            if (event.deltaY > 0) {

                switch(currentPage){
                    case 0:
                        newPageId = aboutUsId;
                        newPageNum = 1;
                        break;
                    default:
                        newPageId = buyProductsId;
                        newPageNum = 2;
                        break;
                }
            }else if(event.deltaY < 0){
                switch(currentPage){
                    case 2:
                        newPageId = aboutUsId;
                        newPageNum = 1;
                        break;
                    default:
                        newPageId = startId;
                        newPageNum = 0;
                        break;
                }
            }

            isTransition.current = true;
            scrollIntoComponent(newPageId, newPageNum);
        }}>
            <Col span={22} style={{ display: 'flex', direction: "column" }}>
                <Row style={{ width: "100%" }}>
                    {[
                        <IndexStart id={startId} setNextPage={() => {
                            scrollIntoComponent(aboutUsId, 1);
                        }} />,

                        <IndexBiggestProblem id={aboutUsId} isOpen={currentPage === 1} setNextPage={() => {
                            scrollIntoComponent(buyProductsId, 2);
                        }} />,

                        <IndexBuyProducts id={buyProductsId} setNextPage={() => {
                            scrollIntoComponent(startId, 0);
                        }} />,

                    ].map((item, index) => <Col key={index} span={24} style={{
                        height: isDesktop ? "100vh" : "inherit",
                        marginBottom: isDesktop ? "5em" : "inherit"
                    }}>
                        {isDesktop || index === 0 ? null : <Divider />}
                        {item}
                    </Col>)}
                </Row>
            </Col>

            <OnlyDesktop>
                <Col span={2} id="menu" >
                    <Menu selectedKeys={[currentPage.toString()]} mode="inline" style={{
                        background: "none", position: "fixed"
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
            </OnlyDesktop>
        </Row>
    );
}
