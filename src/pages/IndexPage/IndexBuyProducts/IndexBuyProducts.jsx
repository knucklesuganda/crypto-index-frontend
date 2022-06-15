import { Row, Col, Card } from "antd";
import { useState, useEffect, Fragment } from "react";
import { Title, Loading, WalletConnector } from "../../../components";
import { listProducts } from "../../../web3/contracts/ObserverContract";
import { useProvider } from "../../../hooks/useProvider";
import { useNavigate } from "react-router";
import { createProductPage } from "../../../routes";
import { useTranslation } from "react-i18next";
import settings from "../../../settings";
import { MobileOnly, useMobileQuery } from "../../../components/MediaQuery";
import './style.css';


function ProductCard(props) {
    const navigate = useNavigate();

    return <Col style={{ cursor: "pointer" }}>
        <Card title={props.product.name} hoverable onClick={() => {
            navigate(createProductPage(props.product.address));
        }} className={props.className} extra={
            <img style={{ width: "4em" }} alt="Product" src={props.product.image} />
        }>{props.product.description}</Card>
    </Col>
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
            }).catch((error) => { });
        }

        return () => { };
    }, [providerData]);

    return <Row id={props.id} style={ isMobile ? { justifyContent: "center", height: "80vh" } : null}>
        <Title>{t('index.buy.title')}</Title>

        {providerData === null ? <WalletConnector handleWalletConnection={handleWalletConnection} /> :

            <Fragment>{!productData ? <Loading style={{ height: "10vh", width: "100wv" }} /> :
                <Row style={{ display: "flex", justifyContent: isMobile ? "center" : "inherit" }}>
                    <Col style={ isMobile ? { marginBottom: "5em" } : { height: "80vh" }}>
                        <Row gutter={[16, 16]} style={{
                            paddingTop: "2em",
                            display: "flex",
                            paddingLeft: isMobile ? "0" : "1em",
                            paddingRight: isMobile ? "0" : "1em",
                            justifyContent: isMobile ? "center" : "inherit"
                        }}>{
                            productData.map((product, index) =>
                                <ProductCard key={index} product={product} className="productCard"/>)
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
