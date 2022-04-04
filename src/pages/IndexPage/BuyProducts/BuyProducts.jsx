import { Row, Col, Card } from "antd";
import { useNavigate } from "react-router";
import { Title } from "../../../components/Title";
import { createBuyPageRoute } from "../../../routes";
import './style.css';


export default function IndexBuyProducts(props) {
    const navigate = useNavigate();

    return <Row>
        <Title id={props.id}>Buy products</Title>

        <Row gutter={[16, 16]} style={{ paddingTop: "2em", paddingLeft: "1em", paddingRight: "1em" }}>
            {[1, 2, 3, 4, 5].map(() =>
                <Col span={4} style={{ cursor: "pointer" }}>
                    <Card title="Meta index" className="productCard" extra={
                        <img style={{ width: 50 }}
                            src="https://prcycoin.com/wp-content/uploads/2021/07/tether-usdt-logo.png" />
                    } onClick={() => { navigate(createBuyPageRoute("meta-index")); }}>
                        Meta index is a compilation of all the meta coins on Ethereum network.
                    </Card>
                </Col>
            )}
        </Row>
    </Row>;
}
