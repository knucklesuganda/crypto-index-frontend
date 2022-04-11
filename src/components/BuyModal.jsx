
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Form, Row, InputNumber, Col, Button, Modal, message, Typography, notification, Card } from "antd";
import { Loading } from "./Loading";
import { approveTokens } from "../web3/contracts/ERC20Contract";
import { buyIndex } from "../web3/contracts/IndexContract";
import { useProvider } from "../hooks/useProvider";
import { getIndexInformation } from "../web3/contracts/IndexContract";
import { addTokenToWallet } from "../web3/wallet/functions";


async function buyProduct(providerData, amount, productData) {

    const transaction = await approveTokens(providerData, productData, amount);
    console.log(transaction);
    await transaction.wait();

    await buyIndex(providerData, productData.address, amount);

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
            }}>{
                    productData === null ? <Loading /> :
                        <Col style={{ paddingLeft: 0, marginBottom: "1em" }}>
                            <Row>
                                <Typography.Title level={2}>{productData.title}</Typography.Title>
                                <Typography.Title level={3}>{productData.price}</Typography.Title>
                            </Row>
                            <Typography.Text>{productData.description}</Typography.Text>
                        </Col>
                }
            </Col>

            <Col span={24}>
                <Form name="buyForm" autoComplete="off"
                    onFinish={(values) => {
                        buyProduct(
                            providerData,
                            ethers.utils.parseEther(values.amount.toString()),
                            productData
                        ).then(() => {
                            message.info(`You successfully bought ${productData.title}!`);
                            setIsOpen(false);

                            setTimeout(() => {
                                notification.info(({
                                    message: 'Add tokens to your wallet',
                                    description: <Col>
                                        <Button type="primary" onClick={() => {
                                            addTokenToWallet(
                                                providerData.provider,
                                                productData.productToken.address,
                                                productData.productToken.symbol,
                                                productData.productToken.decimals,
                                                productData.productToken.image,
                                            );
                                        }}>Click here to add {productData.title} to your wallet</Button>
                                    </Col>,
                                }));
                            }, 2000);

                        }).catch((error) => {
                            message.error({
                                content: error.message !== undefined ? error.message : "Unknown error",
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
