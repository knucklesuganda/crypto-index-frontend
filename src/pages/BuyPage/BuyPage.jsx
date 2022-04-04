import { Form, Row, InputNumber, Col, Button } from "antd";
import { useParams } from "react-router";
import { Title } from "../../components/Title";
import { createERC20 } from "../../web3/contracts/ERC20Contract";
import { createIndex } from "../../web3/contracts/IndexContract";
import { signer } from "../../web3/wallet/providers";


export default function BuyPage(props) {
    const { id } = useParams();
    return <Row style={{
        width: "100wv",
        display: "flex",
        flexDirection: "column",
        alignContent: "space-around",
        justifyContent: "space-between",
        placeContent: "center",
    }}>
        <Col span={24}>
            <Title>{id}</Title>
        </Col>

        <Col span={24}>
            <Form name="buyForm" autoComplete="off"
                onFinish={(values) => {

                    const index = createIndex(signer, "0xBf6039a681979EbCa20300E1b8E50E40ab50b64a");
                    const buyToken = createERC20(signer, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
                    
                    

                }}
                onFinishFailed={(errors) => {
                }}>
                <Form.Item name="amount" rules={[
                    { required: true, message: "Please input the amount" },
                ]} style={{ fontSize: "2em" }}>
                    <InputNumber style={{ width: "20em", height: "5em" }} min={0} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "20em", height: "4em" }}>Submit</Button>
                </Form.Item>
            </Form>
        </Col>
    </Row>;
}
