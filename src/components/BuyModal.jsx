
import { useEffect, useState } from "react";
import { Form, Row, InputNumber, Col, Button, Modal, message, Typography } from "antd";
import { Loading } from "./Loading";
import { allowTokens as approveTokens } from "../web3/contracts/ERC20Contract";
import { buyIndex } from "../web3/contracts/IndexContract";
import { useProvider } from "../hooks/useProvider";
import { getIndexInformation } from "../web3/contracts/IndexContract";


async function buyProduct(providerData, amount, productData) {

    const approveTransaction = await approveTokens(providerData, productData, amount);
    const buyTransaction = await buyIndex(providerData, productData.address, amount);

}


export function BuyModal(props) {
    const [isOpen, setIsOpen] = props.state;
    const { providerData } = useProvider();
    const [productData, setProductData] = useState(null);

    useEffect(() => {

        if (providerData !== null) {
            getIndexInformation(providerData.signer, props.productAddress).then(product => {
                setProductData(product);
            });
        }

        return () => { };
    });

    return <Modal title='Buy product' visible={isOpen} onCancel={() => { setIsOpen(false); }} footer={null}>
        <Row style={{
            width: "100wv",
            display: "flex",
            flexDirection: "column",
            alignContent: "space-around",
            justifyContent: "space-between",
            placeContent: "center",
        }}>
            <Col span={24} style={{
                display: "flex", placeContent: "center", direction: "column",
                alignItems: "center", justifyContent: "center",
            }}>{productData === null ? <Loading /> :
                <Col style={{ paddingLeft: 0, marginBottom: "1em" }}>
                    <Typography.Title level={2}>{productData.title}</Typography.Title>
                    <Typography.Text>{productData.description}</Typography.Text>
                </Col>
                }
            </Col>

            <Col span={24}>
                <Form name="buyForm" autoComplete="off"
                    onFinish={(values) => {
                        buyProduct(
                            providerData,
                            values.amount,
                            productData,
                        ).then(() => {
                            message.info(`You successfully bought ${productData.title}!`);
                        }).catch((error) => {
                            console.log(error);
                            message.error({
                                content: error,
                                duration: 5,
                            });
                        });
                    }}
                    onFinishFailed={(errors) => { }}>

                    <Form.Item name="amount" style={{ marginBottom: "1em" }}
                        rules={[{ required: true, message: "Please input the amount" }]}>
                        <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            min={0} size="large" style={{ width: "100%" }} controls={false} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>Submit</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    </Modal>;
}
