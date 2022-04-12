import { ethers } from "ethers";
import { useParams } from "react-router";
import { useState, useEffect, Fragment } from 'react';
import { Loading } from "../../components/Loading";
import { useProvider } from "../../hooks/useProvider"
import { addTokenNotification } from "../../components/AddToken";
import { approveIndexTokens } from "../../web3/contracts/ERC20Contract";
import { getIndexInformation, getIndexComponents, sellIndex } from "../../web3/contracts/IndexContract";
import { Form, Col, message, InputNumber, Radio, Button, Divider, Typography } from "antd";
import { Pie } from '@ant-design/plots';


async function sellProduct(providerData, amount, productData) {

    const transaction = await approveIndexTokens(providerData, productData, amount);
    await transaction.wait();
    await sellIndex(providerData, productData.address, amount);

}


export default function ProductPage() {
    const { productAddress } = useParams();
    const { providerData } = useProvider();
    const [productData, setProductData] = useState(null);
    const [operationType, setOperationType] = useState('buy');
    const [productComponents, setProductComponents] = useState(null);

    useEffect(() => {

        if (providerData !== null) {
            getIndexInformation(providerData.signer, productAddress).then(product => {
                setProductData(product);
            });

            getIndexComponents(providerData.signer, productAddress).then(components => {
                setProductComponents(components);
            });
        }

        return () => { };
    }, [providerData]);


    return <Col style={{ paddingRight: "1em", paddingLeft: "1em", width: "100wv" }}>{productData === null ? <Loading /> :
        <Fragment>
            <Divider />

            <Col style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
            }}>
                <Col span={24}>
                    <Typography.Title>{productData.title}</Typography.Title>
                </Col>

                <Col>
                    <Form name="productInteractionForm" autoComplete="off" onFinish={(values) => {
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
                        <Form.Item name="sellAmount" rules={[{ required: true, message: "Please input the amount" }]}>
                            <InputNumber min={0} size="large" style={{ width: "100%" }} controls={false}
                                formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                prefix={operationType === 'buy' ? '$' : productData.productToken.symbol}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                        </Form.Item>

                        <Form.Item>
                            <Radio.Group name="operationType" defaultValue="buy" style={{ width: "100%", display: "flex" }}
                                onChange={(event) => { setOperationType(event.target.value); }}>
                                <Radio.Button value="buy" style={{ width: "100%" }}>Buy</Radio.Button>
                                <Radio.Button value="sell" style={{ width: "100%" }}>Sell</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>Sell</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Col>

            <Col span={24}>
                <Typography.Title>Analytics</Typography.Title>

                <Typography.Paragraph style={{ fontSize: "1.2em" }}>
                    About: {productData.longDescription}
                </Typography.Paragraph>

                { productComponents === null ? <Loading /> :
                    <Pie data={productComponents}
                        appendPadding={10}
                        angleField='value'
                        colorField='type'
                        radius={0.9}
                        label={{
                            type: 'inner',
                            offset: '-30%',
                            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                            style: {
                                fontSize: 14,
                                textAlign: 'center',
                            },
                        }}
                        interactions={[{ type: 'element-active' }]}
                    />
                }
            </Col>
        </Fragment>
    }</Col>;

}
