import { Form, Row, InputNumber, Col, Button } from "antd";
import { useParams } from "react-router";
import { Title } from "../../components/Title";
import { createERC20 } from "../../web3/contracts/ERC20Contract";
import { createIndex } from "../../web3/contracts/IndexContract";
import { signer } from "../../web3/wallet/providers";


export default function BuyPage(props) {
    const { id } = useParams();

    async function buyProduct(data){
        const index = createIndex(signer, "0x70bEb70807008B95CeB0cF4a88384b5cCddaF068");
        const buyToken = createERC20(signer, (await index.buyTokenAddress()));

        const transaction = await buyToken.approve(index.address, data.amount, { from: data.account });
        await transaction.wait();
        console.log("Transaction complete");
    }

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
                    buyProduct({
                        amount: values.amount,
                        account: props.account,
                    });
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
