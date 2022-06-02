import { t } from "i18next";
import { Pie } from '@ant-design/plots';
import { useState, useEffect } from 'react';
import { Loading } from "../../../components";
import { formatBigNumber } from "../../../web3/utils";
import { SaveOutlined } from '@ant-design/icons';
import { addTokenToWallet } from "../../../web3/wallet/functions";
import { getIndexComponents } from "../../../web3/contracts/IndexContract";
import { Col, Row, Typography, Table } from "antd";


export function AnalyticsSection(props) {
    const providerData = props.providerData;
    const [productComponents, setProductComponents] = useState(null);
    const textStyle = { fontSize: "1.2em" };

    useEffect(() => {
        getIndexComponents(providerData, props.productAddress).then(components => {
            console.log(components);
            setProductComponents(components);
        });

        return () => { };
    }, [providerData, props.productAddress]);

    if (props.productData === null || productComponents === null) {
        return <Loading />;
    }

    return <Col>
        <Typography.Title>{t('buy_product.analytics.title')}</Typography.Title>

        <Col style={{ border: "1px solid #303030", background: "#0a0a0a", padding: "1em" }}>
            {[
                <Typography.Text style={textStyle}>
                    {t('buy_product.analytics.about_product')}: {props.productData.longDescription}
                </Typography.Text>,

                <Typography.Text style={textStyle} title={t("buy_product.analytics.balance_hint")}>
                    {t('buy_product.analytics.balance')}: {formatBigNumber(props.productData.productToken.balance)} {
                        props.productData.productToken.symbol}
                </Typography.Text>,

                <Typography.Text style={textStyle} title={t("buy_product.analytics.total_locked_value_hint")}>
                    {t('buy_product.analytics.total_locked_value')}: {formatBigNumber(props.productData.totalLockedValue)}$
                </Typography.Text>,

                <Typography.Text style={textStyle} title={t("buy_product.analytics.product_fee_hint")}>
                    {t('buy_product.analytics.product_fee')}: {props.productData.fee}%
                </Typography.Text>,

                <Typography.Text style={textStyle} title={t("buy_product.analytics.liquidity_hint")}>
                    {t('buy_product.analytics.liquidity')}: {formatBigNumber(props.productData.availableLiquidity)} 
                        {props.productData.productToken.symbol}
                </Typography.Text>,

                <Typography.Text title={t('buy_product.analytics.save_token_hint')}
                    style={{ ...textStyle, cursor: "pointer", color: '#1890ff' }}
                    onClick={() => {
                        addTokenToWallet(
                            providerData.provider,
                            {
                                address: props.productData.buyToken.address,
                                symbol: props.productData.buyToken.symbol,
                                decimals: props.productData.buyToken.decimals,
                                image: props.productData.buyToken.image,
                            }
                        );
                    }}>{t('buy_product.analytics.buy_token')}: {props.productData.buyToken.symbol}</Typography.Text>
            ].map((text, index) => <Col key={index}>{text}</Col>)}
        </Col>

        <Row style={{ paddingTop: "1em", width: "100%", display: "flex", alignItems: "center" }} gutter={[100, 16]}>
            <Col span={12}>
                <Pie legend={{ flipPage: false }}
                    appendPadding={10}
                    angleField='value'
                    colorField='type'
                    radius={0.9}
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
                    animation={false} interactions={[{ type: 'element-active' }]}
                />
            </Col>

            <Col>
                <Table bordered style={{ background: "none" }}
                    pagination={{ position: ['none', 'bottomLeft'], simple: true }}
                    dataSource={
                        productComponents.priceData.map((tokenInfo, index) => {
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
                                tokenQuantity: formatBigNumber(tokenInfo.productBalance),
                            };
                        })
                    }

                    columns={[
                        {
                            title: t('buy_product.analytics.table.name'),
                            dataIndex: 'tokenName',
                            key: 'tokenName',
                        },

                        {
                            title: t('buy_product.analytics.table.price'),
                            dataIndex: 'tokenPrice',
                            key: 'tokenPrice',
                        },

                        {
                            title: t('buy_product.analytics.table.quantity'),
                            dataIndex: 'tokenQuantity',
                            key: 'tokenQuantity',
                        },
                    ]}
                />
            </Col>
        </Row>

    </Col>;
}
