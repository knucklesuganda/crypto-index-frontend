import { ethers } from "ethers";
import { Pie } from '@ant-design/plots';
import { useNavigate, useParams } from "react-router";
import { useState, useEffect, Fragment } from 'react';
import { useProvider } from "../../hooks/useProvider";
import { Loading, WalletConnect } from "../../components";
import { getIndexInformation, getIndexComponents, sellIndex, buyIndex } from "../../web3/contracts/IndexContract";
import { Form, Col, Row, InputNumber, Radio, Button, Divider, Typography, Table, message, Card } from "antd";
import { formatBigNumber } from "../../web3/utils";
import { SaveOutlined } from '@ant-design/icons';
import { addTokenToWallet } from "../../web3/wallet/functions";
import { useTranslation } from "react-i18next";
import { t } from "i18next";


function ProductBuyForm(props){
    const providerData = props.providerData;
    const productData = props.productData;
    const [operationType, setOperationType] = useState('buy');
    const { t } = useTranslation();

    return <Form name="productInteractionForm" autoComplete="off" onFinish={(values) => {
        const amount = ethers.utils.parseEther(values.sellAmount.toString());
        let operation;

        if (operationType === "buy") {
            operation = buyIndex({ exchangeToken: productData.buyToken, providerData, amount, productData });
        } else {
            operation = sellIndex({ exchangeToken: productData.productToken, providerData, amount, productData });
        }

        operation.catch((error) => {
            message.error({ content: `${t('error')}: ${error.message}` });
        });

    }}>
        <Form.Item name="sellAmount" rules={[{ required: true, message: t('buy_product.buy_form.amount.error') }]}>
            <InputNumber min={0} size="large" style={{ width: "100%" }} controls={false}
                formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                prefix={operationType === 'buy' ? '$' : productData.productToken.symbol}
                parser={value => value.replace(/\$\s?|(,*)/g, '')} />
        </Form.Item>

        <Form.Item>
            <Radio.Group defaultValue="buy" style={{ width: "100%", display: "flex" }}
                onChange={(event) => { setOperationType(event.target.value) }}>
                <Radio.Button value="buy" style={{ width: "100%" }}>
                    {t('buy_product.buy_form.operation.buy')}
                </Radio.Button>

                <Radio.Button value="sell" style={{ width: "100%" }}>
                    {t("buy_product.buy_form.operation.sell")}
                </Radio.Button>
            </Radio.Group>

            { operationType === "sell" ?
                <Typography.Text type="danger">
                    {t('buy_product.buy_form.operation.sell_advise.start')}
                    <Typography.Text style={{ cursor: "pointer" }} underline target="_blank" onClick={() => {
                        window.open("https://etherscan.io/directory/Exchanges/DEX");
                    }}>{t('buy_product.buy_form.operation.sell_advise.exchanges')}</Typography.Text>
                </Typography.Text> : null}

        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                {operationType === "buy" ? t('buy_product.buy_form.operation.buy') : 
                    t('buy_product.buy_form.operation.sell')}
            </Button>
        </Form.Item>
    </Form>;
}


function AnalyticsSection(props) {
    const providerData = props.providerData;
    const [productComponents, setProductComponents] = useState(null);
    const textStyle = { fontSize: "1.2em" };

    useEffect(() => {
        getIndexComponents(providerData, props.productAddress).then(components => {
            setProductComponents(components);
        });

        return () => { };
    }, [providerData, props.productAddress]);

    if (props.productData === null || productComponents === null) {
        return <Loading />;
    }

    return <Col>
        <Typography.Title>{t('buy_product.analytics.title')}</Typography.Title>

        <Card>
            {[
                <Typography.Text style={textStyle}>
                    {t('buy_product.analytics.about_product')}: {props.productData.longDescription}
                </Typography.Text>,

                <Typography.Text style={textStyle}>
                    {t('buy_product.analytics.balance')}: ({formatBigNumber(props.productData.productToken.balance)} {
                        props.productData.productToken.symbol})
                </Typography.Text>,

                <Typography.Text style={textStyle}>
                    {t('buy_product.analytics.total_locked_value')}: {formatBigNumber(props.productData.totalLockedValue)}$
                </Typography.Text>,

                <Typography.Text title={t('buy_product.analytics.save_token')}
                    style={{ ...textStyle, cursor: "pointer", color: '#1890ff' }} onClick={() => {
                        addTokenToWallet(
                            providerData.provider,
                            {
                                address: props.productData.buyToken.address,
                                symbol: props.productData.buyToken.symbol,
                                decimals: props.productData.buyToken.decimals,
                                image: props.productData.buyToken.image,
                            }
                        )
                    }}>{t('buy_product.analytics.buy_token')}: {props.productData.buyToken.symbol}</Typography.Text>
            ].map((text, index) => <Col key={index}>{text}</Col>)}
        </Card>

        <Row style={{ paddingTop: "1em", width: "100%", display: "flex", alignItems: "center" }} gutter={[100, 16]}>
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

            <Col>
                <Table bordered
                    style={{ background: "none" }} pagination={{ position: ['none', 'none'] }}
                    dataSource={productComponents.priceData.map((tokenInfo, index) => {
                        return {
                            key: index,
                            tokenName: <Row style={{ display: "flex", alignItems: "center" }}>
                                <Typography.Link onClick={() => {
                                    window.open(`https://etherscan.io/token/${tokenInfo.token.address}`);
                                }}>{tokenInfo.name}</Typography.Link>

                                <SaveOutlined style={{ fontSize: "1.2em", marginLeft: "0.5em" }} onClick={() => {
                                    addTokenToWallet(providerData.provider, {
                                        address: tokenInfo.token.address,
                                        symbol: tokenInfo.token.symbol,
                                        decimals: tokenInfo.token.decimals,
                                        image: tokenInfo.token.image,
                                    });
                                }} title={t('buy_product.analytics.save_token')} />
                            </Row>,
                            tokenPrice: `${formatBigNumber(tokenInfo.price)}$`,
                        };
                    })}
                    columns={[
                        { title: 'Token name', dataIndex: 'tokenName', key: 'tokenName' },
                        { title: 'Token price', dataIndex: 'tokenPrice', key: 'tokenPrice' },
                    ]}
                />
            </Col>
        </Row>

    </Col>;
}


export default function ProductPage() {
    const { productAddress } = useParams();
    const { providerData, handleWalletConnection } = useProvider();
    const [productData, setProductData] = useState(null);
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
    }, [providerData]);

    return <Col style={{
        paddingRight: "1em", paddingBottom: "4em", paddingLeft: "1em", width: "100wv"
    }}>{productData === null ?
        <WalletConnect handleWalletConnection={handleWalletConnection} /> :
        <Fragment>
            <Divider style={{ marginTop: "0.2em" }} />

            <Col style={{
                width: "100%", display: "flex",
                alignItems: "center", flexDirection: "column",
                alignContent: "center", justifyContent: "center",
            }}>
                <Row style={{ display: "flex", alignItems: "baseline" }}>
                    <Typography.Title level={2} title={t('buy_product.product_name')} style={{
                        cursor: "pointer",
                        margin: 0,
                        fontWeight: 100,
                        marginBottom: "0.3em",
                    }}
                    onMouseEnter={(event) => { event.target.style.color = '#1890ff'; }}
                    onMouseLeave={(event) => { event.target.style.color = '#bfbfbf'; }}

                    onClick={() => {
                        addTokenToWallet(
                            providerData.provider,
                            {
                                address: productData.productToken.address,
                                symbol: productData.productToken.symbol,
                                decimals: productData.productToken.decimals,
                                image: productData.productToken.image,
                            }
                        )
                    }}>{productData.name}</Typography.Title>

                    <Typography.Title level={4} style={{ margin: 0, fontWeight: 100 }} title={t('buy_product.product_price')}>
                        ({formatBigNumber(productData.price)}$)
                    </Typography.Title>
                </Row>

                <ProductBuyForm providerData={providerData} productData={productData} />
            </Col>

            <Col span={24}>
                <AnalyticsSection providerData={providerData} productAddress={productAddress} productData={productData} />
            </Col>
        </Fragment>}
    </Col>;

}
