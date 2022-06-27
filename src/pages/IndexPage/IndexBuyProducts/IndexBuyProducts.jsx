import { Row, Col, Typography } from "antd";
import settings from "../../../settings";
import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { createProductPage } from "../../../routes";
import { useProvider } from "../../../hooks/useProvider";
import { Title, Loading, WalletConnector } from "../../../components";
import { MobileOnly, useMobileQuery } from "../../../components/MediaQuery";
import { Observer } from "../../../web3/contracts/management/observer";


function ProductCard(props) {
    const navigate = useNavigate();
    const { product } = props;
    const [isHover, setIsHover] = useState(isMobile);
    const isMobile = useMobileQuery();

    let backgroundImage, productType;

    if (product.address === '0xDBCFC1Ec8aF08aB1943aD6dEf907BD0f0b7C4fE0') {
        backgroundImage = '/images/indexBg.png';
        productType = 'index';
    } else if (product.address === '0x7212569605978ce4cC26489611df873706fbc2A1') {
        backgroundImage = '/images/ethIndexBg.png';
        productType = 'index';
    }

    return <Col style={{
        display: "flex",
        placeContent: "center",
        alignItems: "center",
        marginRight: isMobile ? "0" : "2em",
        marginBottom: "5em",
        cursor: "pointer",
    }}
        onMouseEnter={() => { setIsHover(true); }}
        onMouseLeave={() => { setIsHover(false); }}
        onClick={() => { navigate(createProductPage(productType, product.address)); }}>

        <Col style={{
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
            filter: isHover ? "grayscale(100%) brightness(0.2)" : "none",
            margin: "0",
        }} />

        <Typography.Text style={{
            fontSize: isMobile ? "6em" : "4em",
            opacity: isHover ? 1 : 0,
            filter: "none",
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
        }}>{product.name}</Typography.Text>

    </Col >;
}

export function IndexBuyProducts(props) {
    const [productData, setProductData] = useState(null);
    const { providerData, handleWalletConnection } = useProvider();
    const { t } = useTranslation();
    const isMobile = useMobileQuery();

    useEffect(() => {
        if (providerData !== null) {
            const observer = new Observer(settings.OBSERVER_ADDRESS, providerData);

            observer.listProducts().then((productData) => {
                setProductData(productData);
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
                            paddingLeft: isMobile ? "0" : "1em",
                            paddingRight: isMobile ? "0" : "2em",
                            justifyContent: isMobile ? "center" : "inherit",
                        }}>{productData.map((product, index) => <ProductCard key={index} product={product} />)}</Row>
                    </Col>
                </Row>
            }</Fragment>
        }

        <MobileOnly>
            <div style={{ paddingBottom: "5em" }}></div>
        </MobileOnly>
    </Row>;
}
