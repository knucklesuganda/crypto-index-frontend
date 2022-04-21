import { Row, Col, Card } from "antd";
import { useState, useEffect, Fragment } from "react";
import { NextPage, Title, Loading, BuyModal, WalletConnect } from "../../../components";
import { listProducts } from "../../../web3/contracts/ObserverContract";
import { useProvider } from "../../../hooks/useProvider";
import './style.css';


function ProductCard(props) {
    return <Col style={props.style}>
        <Card title={props.title} hoverable onClick={props.handleClick} className={props.className} extra={<img
            style={{ width: "4em" }} alt={props.title} src={props.image} />}>
            {props.description}
        </Card>
    </Col>
}

export function IndexBuyProducts(props) {
    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productData, setProductData] = useState(null);
    const { providerData, handleWalletConnection } = useProvider();

    useEffect(() => {
        if (providerData !== null) {
            listProducts(providerData, '0xA8Ee798d017AdfD9B4b4B829349D4fd8f878E3eA').then((productData) => {
                setProductData(productData);
            });
        }

        return () => { };
    }, [providerData]);

    const placeholderProducts = [];
    for (let i = 0; i < 18; i++) {
        placeholderProducts.push(<ProductCard
            key={i} title="Product image"
            style={{ cursor: "inherit" }}
            image="https://picsum.photos/200"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh vel tortor."
        />);
    }

    return <Row>
        <Title id={props.id}>Buy products</Title>

        {providerData === null ? <WalletConnect handleWalletConnection={handleWalletConnection}
            placeholder={placeholderProducts} /> : <Fragment>
            {!productData ? <Loading style={{ height: "10vh", width: "100wv" }} /> :
                <Row style={{ display: "flex", justifyContent: "center" }}>

                    <Col style={{ height: "80vh" }}>
                        <Row gutter={[16, 16]} style={{ paddingTop: "2em", paddingLeft: "1em", paddingRight: "1em" }}>{
                            productData.map((product, index) =>
                                <ProductCard
                                    key={index}
                                    title={product.name}
                                    className="productCard"
                                    productImage={product.image}
                                    description={product.description}
                                    image={product.image}
                                    handleClick={() => {
                                        setIsBuyOpen(true);
                                        setCurrentProduct(product.address);
                                    }}
                                    style={{ cursor: "pointer" }}
                                />
                            )}</Row>
                    </Col>

                    {isBuyOpen ? <BuyModal productAddress={currentProduct} state={[isBuyOpen, setIsBuyOpen]} /> : null}
                </Row>
            }
        </Fragment>}
    </Row>;
}
