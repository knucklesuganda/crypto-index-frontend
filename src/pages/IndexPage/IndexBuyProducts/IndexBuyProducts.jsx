import { useState, useEffect } from "react";
import { Row, Col, Card, message } from "antd";
import { BuyModal } from "../../../components/BuyModal";
import { Title } from "../../../components/Title";
import { connectWeb3Account } from "../../../web3";
import './style.css';


export function IndexBuyProducts(props) {
    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const [account, setAccount] = useState(null);
    const [productAddress, setProductAddress] = useState(null);

    useEffect(() => {

        connectWeb3Account().then((account) => {
            setAccount(account);
        }).catch((error) => {
            message.error({
                content: error.toString(),
                duration: 5,
            });
        });

        return () => {};
    }, [connectWeb3Account, setAccount]);

    if(account === null){
        return <Row>
            
        </Row>;
    }

    return <Row>
        <Title id={props.id}>Buy products</Title>

        <Row gutter={[16, 16]} style={{ paddingTop: "2em", paddingLeft: "1em", paddingRight: "1em" }}>
            {[1, 2, 3, 4, 5].map((index) =>
                <Col key={index} span={4} style={{ cursor: "pointer" }}>
                    <Card title="Meta index" className="productCard" extra={
                        <img style={{ width: 50 }} alt='Meta index'
                            src="https://prcycoin.com/wp-content/uploads/2021/07/tether-usdt-logo.png" />
                    } onClick={() => {
                        setIsBuyOpen(true);
                        setProductAddress('0x69Db4AB99Db469D486d3802cA60b2cf88Ab9eBA0');
                    }}>
                        Meta index is a compilation of all the meta coins on Ethereum network.
                    </Card>
                </Col>
            )}
        </Row>

        <BuyModal account={props.account} productAddress={productAddress} state={[isBuyOpen, setIsBuyOpen]} />
    </Row>;
}
