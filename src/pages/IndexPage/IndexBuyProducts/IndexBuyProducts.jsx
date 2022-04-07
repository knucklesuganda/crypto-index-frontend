import { useState, useEffect, Fragment } from "react";
import { Row, Col, Card, message, Button, Typography } from "antd";
import { BuyModal } from "../../../components/BuyModal";
import { Title } from "../../../components/Title";
import { connectWallet } from "../../../web3/wallet/providers";
import { createIndex } from "../../../web3/contracts/IndexContract";
import './style.css';


function ProductCard(props) {
    return <Col span={4} style={props.style}>
        <Card title={props.title} onClick={props.handleClick} className={props.className} extra={<img
            style={{ width: 50 }} alt={props.title} src={props.image} />}>
            {props.description}
        </Card>
    </Col>
}


async function getProductInformation(providerData) {

    const productsList = [];

    for (let i = 0; i < 10; i++) {
        const productAddress = '0x235914B0e3fec83C084d0bdE2eb4FF8D98e2D184';
        const product = createIndex(providerData.signer, productAddress);

        productsList.push({
            image: "https://picsum.photos/200",
            address: productAddress,
            title: await product.name(),
            description: await product.shortDescription(),
        });
    }

    return productsList;
}


export function IndexBuyProducts(props) {
    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const [providerData, setProviderData] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productData, setProductData] = useState([]);


    useEffect(() => {

        if (providerData !== null) {
            getProductInformation(providerData).then((productData) => {
                setProductData(productData);
            })
        }

        return () => { }
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

        {providerData === null ? <Row gutter={[25, 55]} style={{
            display: "flex", paddingLeft: "1em", rowGap: "10px", columnGap: "10px"
        }}>
            <Row style={{ width: "100%", zIndex: -1, filter: "blur(4px)" }}>{placeholderProducts}</Row>

            <Row style={{
                position: "absolute",
                zIndex: 10,
                left: "40%", right: "50%",
                top: "20%", bottom: "50%",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
            }}>
                <Card style={{
                    boxShadow: "3px 3px 84px 0px rgba(255, 255, 255, 0.2)"
                }}>
                    <Typography.Text style={{ fontSize: "1.2em" }}>
                        You must connect your wallet in order to buy products
                    </Typography.Text>

                    <Button type="primary" size="large" style={{
                        width: "20em", marginTop: "1em",
                    }}
                        onClick={() => {
                            connectWallet().then((providerData) => {
                                setProviderData(providerData);
                            }).catch((error) => {
                                message.error({
                                    content: error.toString(),
                                    duration: 5,
                                });
                            });
                        }}>Connect account</Button>
                </Card>
            </Row>
        </Row>
            :
            <Fragment>
                <Row gutter={[16, 16]} style={{ paddingTop: "2em", paddingLeft: "1em", paddingRight: "1em" }}>
                    {productData.map((product, index) =>
                        <ProductCard
                            key={index}
                            title={product.title}
                            className="productCard"
                            productImage={product.image}
                            description={product.description}
                            handleClick={() => {
                                setIsBuyOpen(true);
                                setCurrentProduct(product.address);
                            }}
                            style={{ cursor: "pointer" }}
                        />
                    )}
                </Row>

                <BuyModal account={providerData} productAddress={currentProduct} state={[isBuyOpen, setIsBuyOpen]} />
            </Fragment>}
    </Row>;
}
