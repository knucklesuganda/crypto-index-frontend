import { Row, Col } from "antd";
import { useState, useEffect, Fragment } from "react";
import { Title, Loading, WalletConnector } from "../../../components";
import { listProducts } from "../../../web3/contracts/ObserverContract";
import { useProvider } from "../../../hooks/useProvider";
import { useNavigate } from "react-router";
import { createProductPage } from "../../../routes";
import { useTranslation } from "react-i18next";
import settings from "../../../settings";
import { MobileOnly, useMobileQuery } from "../../../components/MediaQuery";


function ProductCard(props) {
    const navigate = useNavigate();
    const { product } = props;
    const isMobile = useMobileQuery();
    const [isHover, setIsHover] = useState(false);

    let backgroundImage;

    if (product.address === '0xDBCFC1Ec8aF08aB1943aD6dEf907BD0f0b7C4fE0') {
        backgroundImage = '/images/indexBg.png';
    }else if(product.address === '0x7212569605978ce4cC26489611df873706fbc2A1'){
        backgroundImage = '/images/ethIndexBg.png';
    }

    return <Col onClick={() => { navigate(createProductPage(product.address)); }}
        style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            borderRadius: "10%",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "initial",
            backgroundPosition: "center",
            cursor: "pointer",
            width: isMobile ? "100vw" : "20vw",
            height: isMobile ? "50vh" : "20vh",
            border: "2px solid white",
            boxShadow: isHover ? "none" : "0 0 16px 10px rgba(255, 255, 255, 0.2)",
            transition: "200ms",
            filter: isHover ? "grayscale(100%) brightness(0.5)" : "none",
            margin: "0",
            display: "flex",
            placeContent: "center",
            marginRight: isMobile ? "0" : "5em",
            marginBottom: "5em",
        }}
        onMouseEnter={() => { setIsHover(true); }} onMouseLeave={() => { setIsHover(false); }} />;
}

export function IndexBuyProducts(props) {
    const [productData, setProductData] = useState(null);
    const { providerData, handleWalletConnection } = useProvider();
    const { t } = useTranslation();
    const isMobile = useMobileQuery();

    useEffect(() => {
        if (providerData !== null) {
            listProducts(providerData, settings.OBSERVER_ADDRESS).then((productData) => {
                setProductData(productData);
            }).catch((error) => {
                console.log(error)
            });
        }

        return () => { };
    }, [providerData]);

    return <Row id={props.id} style={isMobile ? { justifyContent: "center", height: "80vh" } : null}>
        <Title>{t('index.buy.title')}</Title>

        {providerData === null ? <WalletConnector handleWalletConnection={handleWalletConnection} /> :

            <Fragment>{!productData ? <Loading style={{ height: "10vh", width: "100wv" }} /> :
                <Row style={{ display: "flex", justifyContent: isMobile ? "center" : "inherit" }}>
                    <Col style={isMobile ? { marginBottom: "5em" } : { height: "80vh" }}>
                        <Row gutter={[16, 16]} style={{
                            paddingTop: "2em",
                            display: "flex",
                            paddingLeft: isMobile ? "0" : "2em",
                            paddingRight: isMobile ? "0" : "2em",
                            justifyContent: isMobile ? "center" : "inherit"
                        }}>{
                                productData.map((product, index) =>
                                    <ProductCard key={index} product={product} />)
                            }</Row>
                    </Col>
                </Row>
            }</Fragment>
        }

        <MobileOnly>
            <div style={{ paddingBottom: "5em" }}></div>
        </MobileOnly>
    </Row>;
}
