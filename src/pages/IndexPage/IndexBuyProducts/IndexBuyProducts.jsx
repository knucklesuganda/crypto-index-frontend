import { useState, Fragment } from "react";
import { Row, Col, Card, message, Button, Space, Typography } from "antd";
import { BuyModal } from "../../../components/BuyModal";
import { Title } from "../../../components/Title";
import { connectWallet } from "../../../web3/wallet/providers";
import './style.css';


function ProductCard(props) {
    return <Col key={props.index} span={4} style={props.style}>
        <Card title={props.title} onClick={props.handleClick} className={props.className} extra={<img
            style={{ width: 50 }} alt={props.title} src={props.image} />}>
            {props.description}
        </Card>
    </Col>
}


export function IndexBuyProducts(props) {
    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const [account, setAccount] = useState(null);
    const [productAddress, setProductAddress] = useState(null);

    const placeholderProducts = [];

    for (let i = 0; i < 18; i++) {
        placeholderProducts.push(<ProductCard
            index={i} title="Product image"
            style={{ cursor: "inherit" }}
            image="https://picsum.photos/200"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh vel tortor."
        />);
    }

    return <Row>
        <Title id={props.id}>Buy products</Title>

        {account === null ? <Row gutter={[25, 55]} style={{
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
                        connectWallet().then((account) => {
                            setAccount(account);
                        }).catch((error) => {
                            message.error({
                                content: error.toString(),
                                duration: 5,
                            });
                        });
                    }}>Connect account</Button>
                </Card>
            </Row>
        </Row> :
            <Fragment>
                <Row gutter={[16, 16]} style={{ paddingTop: "2em", paddingLeft: "1em", paddingRight: "1em" }}>
                    {[1, 2, 3, 4, 5].map((index) =>
                        <ProductCard
                            index={index}
                            title="Meta index"
                            className="productCard"
                            productImage="https://i.picsum.photos/id/1005/200/300.jpg"
                            handleClick={() => {
                                setIsBuyOpen(true);
                                setProductAddress('0x725CA50819AD2353d69311f7b090ED1541d3e443');
                            }}
                            style={{ cursor: "pointer" }}
                        />
                    )}
                </Row>

                <BuyModal account={props.account} productAddress={productAddress} state={[isBuyOpen, setIsBuyOpen]} />
            </Fragment>}
    </Row>;
}
