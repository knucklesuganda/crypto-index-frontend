import { Row, Col, Card, message } from "antd";
import { useState, useEffect, Fragment } from "react";
import { Title, Loading, WalletConnector } from "../../../components";
import { listProducts } from "../../../web3/contracts/ObserverContract";
import { useProvider } from "../../../hooks/useProvider";
import { useNavigate } from "react-router";
import { createProductPage } from "../../../routes";
import { useTranslation } from "react-i18next";
import settings from "../../../settings";
import './style.css';


function ProductCard(props) {
    const navigate = useNavigate();

    return <Col style={props.style}>
        <Card title={props.product.name} hoverable onClick={() => {
            navigate(createProductPage(props.product.address));
        }} className={props.className} extra={<img style={{ width: "4em" }} src={props.product.image} />}>
            {props.product.description}
        </Card>
    </Col>
}

export function IndexBuyProducts(props) {
    const [productData, setProductData] = useState(null);
    const { providerData, handleWalletConnection } = useProvider();
    const { t } = useTranslation();

    useEffect(() => {
        if (providerData !== null) {
            listProducts(providerData, settings.OBSERVER_ADDRESS).then((productData) => {
                setProductData(productData);
            }).catch((error) => { });
        }

        return () => { };
    }, [providerData]);

    const placeholderProducts = [];

    for (let i = 0; i < 18; i++) {
        placeholderProducts.push(
            <ProductCard style={{ cursor: "inherit" }} key={i}
                product={{
                    name: "Product image",
                    image: "https://picsum.photos/200",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh vel tortor."
                }}
            />
        );
    }


    return <Row>
        <Title id={props.id}>{t('index.buy.title')}</Title>

        {providerData === null ? <WalletConnector handleWalletConnection={handleWalletConnection} /> :

            <Fragment>{
                !productData ? <Loading style={{ height: "10vh", width: "100wv" }} /> :
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Col style={{ height: "80vh" }}>
                            <Row gutter={[16, 16]} style={{
                                paddingTop: "2em",
                                paddingLeft: "1em",
                                paddingRight: "1em"
                            }}>{
                                productData.map((product, index) =>
                                    <ProductCard key={index} product={product}
                                        className="productCard"
                                        style={{ cursor: "pointer" }}
                                    />
                                )
                            }</Row>
                        </Col>
                    </Row>}
            </Fragment>
        }

    </Row>;
}
