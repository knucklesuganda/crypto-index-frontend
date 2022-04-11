import { useParams } from "react-router";
import { Row, Form, Col, message, InputNumber, Button, Divider } from "antd";
import { Loading } from "../../components/Loading";
import { useState, useEffect, Fragment } from 'react';
import { useProvider } from "../../hooks/useProvider"
import { addTokenNotification } from "../../components/AddToken";
import { getIndexInformation, sellIndex } from "../../web3/contracts/IndexContract";
import { BuyProduct } from "../../components/BuyProduct";
import { ethers } from "ethers";
import { approveIndexTokens } from "../../web3/contracts/ERC20Contract";


async function sellProduct(providerData, amount, productData){

    const transaction = await approveIndexTokens(providerData, productData, amount);
    await transaction.wait();
    await sellIndex(providerData, productData.address, amount);

}


export default function ProductPage() {
    const { productAddress } = useParams();
    const { providerData } = useProvider();
    const [productData, setProductData] = useState(null);

    useEffect(() => {

        if (providerData !== null) {
            getIndexInformation(providerData.signer, productAddress).then(product => {
                setProductData(product);
            });
        }

        return () => { };
    });

    return <Row style={{ paddingLeft: '1em', width: "100wv" }}>{productData === null ? <Loading /> :
        <Fragment>
            <Divider />

            <Row>
                <Col>
                    <BuyProduct productAddress={productAddress} />
                </Col>

                <Col span={24}>
                    <Form name="sellForm" autoComplete="off"
                        onFinish={(values) => {
                            sellProduct(
                                providerData,
                                ethers.utils.parseEther(values.sellAmount.toString()),
                                productData,
                            ).then(() => {
                                message.info(`You successfully sold ${productData.title}!`);
                                addTokenNotification(providerData, productData);
                            }).catch((error) => {
                                message.error({
                                    content: error.message !== undefined ? error.message : "Unknown error",
                                    duration: 5,
                                });
                            });
                        }}>

                        <Form.Item name="sellAmount" style={{ marginBottom: "1em" }}
                            rules={[{ required: true, message: "Please input the amount" }]}>
                            <InputNumber
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={0} size="large" style={{ width: "100%" }} controls={false} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>Sell</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </Fragment>
    }</Row >;

}
