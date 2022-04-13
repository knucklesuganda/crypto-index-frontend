import { ethers } from "ethers";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect, Fragment } from 'react';
import { useProvider } from "../../hooks/useProvider"
import { Loading, WalletConnect } from "../../components";
import { getIndexInformation, getIndexComponents, sellIndex, buyIndex } from "../../web3/contracts/IndexContract";
import { Form, Col, Row, InputNumber, Radio, Button, Divider, Typography, Table, message, Card } from "antd";
import { Pie } from '@ant-design/plots';
import { formatBigNumber } from "../../web3/utils";


function AnalyticsSection(props) {
    const providerData = props.providerData;
    const [productComponents, setProductComponents] = useState(null);

    useEffect(() => {
        getIndexComponents(providerData, props.productAddress).then(components => {
            setProductComponents(components);
        });

        return () => { };
    }, [providerData, props.productAddress]);

    if (props.productData === null || productComponents === null) {
        return <Loading />;
    }

    return <Fragment>
        <Typography.Title>Analytics</Typography.Title>

        <Card>
            {[
                `About: ${props.productData.longDescription}`,
                `Your balance: ${formatBigNumber(props.productData.productToken.balance)}
                ${props.productData.productToken.symbol}`,
                `Buy Token: ${props.productData.buyToken.symbol}`,
            ].map((text, index) =>
                <Col key={index}><Typography.Text style={{ fontSize: "1.2em" }}>{text}</Typography.Text></Col>)
            }
        </Card>

        <Row style={{ width: "100%", display: "flex", alignItems: "center" }} gutter={[100, 16]}>
            <Col span={12}>
                <Pie appendPadding={10} angleField='value' colorField='type' radius={0.9}
                    data={productComponents.ratioData}
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
            </Col>

            <Col span={12}>
                <Table bordered
                    style={{ background: "none" }} pagination={{ position: ['none', 'none'] }}
                    dataSource={productComponents.priceData.map((tokenPrice, index) => {
                        return {
                            key: index,
                            tokenName: tokenPrice.name,
                            tokenPrice: `${formatBigNumber(tokenPrice.price)}$`,
                        };
                    })}
                    columns={[
                        { title: 'Token name', dataIndex: 'tokenName', key: 'tokenName' },
                        { title: 'Token price', dataIndex: 'tokenPrice', key: 'tokenPrice' },
                    ]}
                />
            </Col>
        </Row>
    </Fragment>;
}


export default function ProductPage() {
    const { productAddress } = useParams();
    const { providerData, handleWalletConnection } = useProvider();
    const [productData, setProductData] = useState(null);
    const [operationType, setOperationType] = useState('buy');
    const navigate = useNavigate();

    useEffect(() => {

        if (providerData !== null) {
            getIndexInformation(providerData, productAddress).then(product => {
                setProductData(product);
            }).catch((error) => {
                navigate('/not_found');
            });
        }

        return () => { };
    }, [providerData, productAddress]);

    return <Col style={{ paddingRight: "1em", paddingLeft: "1em", width: "100wv" }}>{productData === null ?
        <WalletConnect handleWalletConnection={handleWalletConnection} /> :
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
                <Col span={24} style={{ display: "inline-flex", alignItems: "baseline" }}>
                    <Typography.Text style={{ fontSize: "2em" }}>{productData.name}</Typography.Text>
                    <Typography.Text style={{ fontSize: "1.2em" }}>({formatBigNumber(productData.price)}$)</Typography.Text>
                </Col>

                <Col>
                    <Form name="productInteractionForm" autoComplete="off" onFinish={(values) => {
                        const amount = ethers.utils.parseEther(values.sellAmount.toString());
                        let operation;

                        if (operationType === "buy") {
                            operation = buyIndex({ providerData, amount, productData });
                        } else {
                            operation = sellIndex({ providerData, amount, productData });
                        }

                        operation.catch((error) => {
                            message.error({ content: `Error: ${error.message}` });
                        });

                    }}>
                        <Form.Item name="sellAmount" rules={[{ required: true, message: "Please input the amount" }]}>
                            <InputNumber min={0} size="large" style={{ width: "100%" }} controls={false}
                                formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                prefix={operationType === 'buy' ? '$' : productData.productToken.symbol}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                        </Form.Item>

                        <Form.Item>
                            <Radio.Group defaultValue="buy" style={{ width: "100%", display: "flex" }}
                                onChange={(event) => { setOperationType(event.target.value); }}>
                                <Radio.Button value="buy" style={{ width: "100%" }}>Buy</Radio.Button>
                                <Radio.Button value="sell" style={{ width: "100%" }}>Sell</Radio.Button>
                            </Radio.Group>
                            {operationType === "sell" ?
                                <Typography.Text type="danger">We advise selling on exchanges</Typography.Text> : null}
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>{operationType}</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Col>

            <Col span={24}>
                <AnalyticsSection providerData={providerData} productAddress={productAddress} productData={productData} />
            </Col>
        </Fragment>
    }</Col>;

}
