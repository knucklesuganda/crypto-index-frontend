import { useState } from "react";
import { Row, Col, Card } from "antd";
import BuyModal from "../../../components/BuyModal";
import { Title } from "../../../components/Title";
import './style.css';


export default function IndexBuyProducts(props) {
    const [isBuyOpen, setIsBuyOpen] = useState(false);

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
                    }}>
                        Meta index is a compilation of all the meta coins on Ethereum network.
                    </Card>
                </Col>
            )}
        </Row>

        <BuyModal account={props.account} state={[isBuyOpen, setIsBuyOpen]} />
    </Row>;
}
