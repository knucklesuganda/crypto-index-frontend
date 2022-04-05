import { Fragment, useEffect, useState } from "react";
import { Form, Row, InputNumber, Col, Button, Modal, message, Typography } from "antd";
import { Title } from "./Title";
import { Loading } from "./Loading";
import { createERC20 } from "../web3/contracts/ERC20Contract";
import { createIndex } from "../web3/contracts/IndexContract";
import { signer } from "../web3/wallet/providers";



async function buyProduct(data) {
    const index = createIndex(signer, data.productAddress);
    const buyToken = createERC20(signer, (await index.buyTokenAddress()));
    const approveTransaction = await buyToken.approve(index.address, data.amount, { from: data.account });

    console.log(approveTransaction);
    await approveTransaction.wait();

    console.log("Adding funds");
    const buyTransaction = await index.addFunds(data.amount);
    await buyTransaction.wait();
}

async function getAccountData(account, productData){
    
    const buyToken = createERC20(signer, productData.buyTokenAddress);
    const tokenBalance = await buyToken.balanceOf(account);

    return {
        accountBalance: tokenBalance,
    }

}


export default function BuyModal(props) {
    const [isOpen, setIsOpen] = props.state;
    const [productData, setProductData] = useState(null);
    const [accountData, setAccountData] = useState(null);

    useEffect(() => {

        setProductData({
            name: "Meta index",
            buyTokenName: "USDC",
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        });

        getAccountData(props.account, productData).then(accountData => {
            setAccountData({
                balance: accountData.balance,
            });
        });

        return () => { };
    }, []);

    if (productData === null) {
        return <Loading />;
    }

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
                display: "flex",
                placeContent: "center",
                alignItems: "center",
                justifyContent: "center",
                direction: "column",
            }}>{
                    productData === null ? <Loading /> :
                        <Fragment>
                            <Col style={{ paddingLeft: 0, marginBottom: "1em", display: "flex", direction: "column" }}>
                                {[
                                    `Product: ${productData.name}`,
                                    `Address: ${productData.address}`,
                                ].map((text, index) =>
                                    <Typography.Text style={{ padding: 0, fontSize: "1.2em" }}>{text}</Typography.Text>
                                )}
                            </Col>
                        </Fragment>
                }
            </Col>

            <Col span={24}>
                <Form name="buyForm" autoComplete="off"
                    onFinish={(values) => {
                        buyProduct({ amount: values.amount, account: props.account }).catch((error) => {
                            message.error({
                                content: error.message,
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
                            min={0} size="large" style={{ width: "30em" }} controls={false} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: "100%", height: "3em" }}>Submit</Button>
                    </Form.Item>
                </Form>
            </Col>

        </Row>
    </Modal>;
}
