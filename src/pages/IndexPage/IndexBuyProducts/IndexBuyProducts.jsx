import { Row, Col, Card } from "antd";
import { useState, useEffect, Fragment } from "react";
import { Title, Loading, WalletConnector } from "../../../components";
import { listProducts } from "../../../web3/contracts/ObserverContract";
import { useProvider } from "../../../hooks/useProvider";
import { useNavigate } from "react-router";
import { createProductPage } from "../../../routes";
import { useTranslation } from "react-i18next";
import settings from "../../../settings";
import './style.css';
import { useMobileQuery } from "../../../components/MediaQuery";


function ProductCard(props) {
    const navigate = useNavigate();

    return <Col style={props.style}>
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

    return <Row id={props.id} style={ isMobile ? { paddingBottom: "5em" } : null}>
        <Title>{t('index.buy.title')}</Title>

        {providerData === null ? <WalletConnector handleWalletConnection={handleWalletConnection} /> :

            <Fragment>{!productData ? <Loading style={{ height: "10vh", width: "100wv" }} /> :
                <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Col style={{ height: "80vh" }}>
                        <Row gutter={[16, 16]} style={{
                            paddingTop: "2em",
                            paddingLeft: isMobile ? "0" : "1em",
                            paddingRight: isMobile ? "0" : "1em",
                            display: "flex",
                            justifyContent: "center"
                        }}>{
                            productData.map((product, index) =>
                                <ProductCard key={index} product={product} 
                                    className="productCard" style={{ cursor: "pointer" }} />
                            )
                        }</Row>
                    </Col>
                </Row>
            }</Fragment>
        }

    </Row>;
}
