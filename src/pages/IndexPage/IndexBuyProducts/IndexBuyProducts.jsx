import { useState, useEffect, Fragment } from "react";
import { Row, Col, Card, message, Button } from "antd";
import { BuyModal } from "../../../components/BuyModal";
import { Title } from "../../../components/Title";
import { connectWeb3Account } from "../../../web3";
import './style.css';


function ProductCard(props) {
    return <Col key={props.index} span={4} style={{ cursor: "pointer" }}>
        <Card title={props.title} className="productCard"
            extra={<img style={{ width: 50 }} alt={props.title} src={props.image} />}
            onClick={props.handleClick}>{props.description}</Card>
    </Col>
}


export function IndexBuyProducts(props) {
    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const [account, setAccount] = useState(null);
    const [productAddress, setProductAddress] = useState(null);

    return <Row>
        <Title id={props.id}>Buy products</Title>

        {account === null ? <Row style={{ display: "flex" }}>
            {[1, 2, 3, 4, 5].map((index) =>
                <ProductCard
                    index={index}
                    image="https://i.picsum.photos/id/1005/200/300.jpg"
                    title="Product image"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh vel tortor."
                />
            )}

            <Button type="primary" onClick={() => {
                connectWeb3Account().then((account) => {
                    setAccount(account);
                }).catch((error) => {
                    message.error({
                        content: error.toString(),
                        duration: 5,
                    });
                });
            }}>Connect account</Button>
        </Row>
        :
        <Fragment>
            <Row gutter={[16, 16]} style={{ paddingTop: "2em", paddingLeft: "1em", paddingRight: "1em" }}>
                {[1, 2, 3, 4, 5].map((index) =>
                    <ProductCard
                        title="Meta index"
                        productImage="https://i.picsum.photos/id/1005/200/300.jpg"
                        handleClick={() => {
                            setIsBuyOpen(true);
                            setProductAddress('0x725CA50819AD2353d69311f7b090ED1541d3e443');
                        }}
                    />
                )}
            </Row>

            <BuyModal account={props.account} productAddress={productAddress} state={[isBuyOpen, setIsBuyOpen]} />
        </Fragment>}
    </Row>;
}
