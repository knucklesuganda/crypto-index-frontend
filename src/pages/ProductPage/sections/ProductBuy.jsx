import { ethers } from "ethers";
import { useState, Fragment } from 'react';
import { formatBigNumber, formatNumber } from "../../../web3/utils";
import { useTranslation } from "react-i18next";
import { sellIndex, buyIndex, retrieveIndexDebt } from "../../../web3/contracts/IndexContract";
import { Form, Col, InputNumber, Radio, Button, Divider, Typography, message, Card } from "antd";



export function ProductBuySection(props) {
    const providerData = props.providerData;
    const productData = props.productData;
    const [operationType, setOperationType] = useState('buy');
    const [amount, setAmount] = useState(0);
    const { t } = useTranslation();

    return <Fragment>
        <Form name="productInteractionForm" style={{ minWidth: "20vw " }} autoComplete="off" onFinish={(values) => {
            const amount = ethers.utils.parseEther(values.sellAmount.toString());
            let operation;

            if (operationType === "buy") {
                operation = buyIndex({
                    amount, providerData, productData, notificationMessage: t('add_token_notification')
                });
            } else {
                operation = sellIndex({
                    amount, providerData, productData, notificationMessage: t('add_token_notification')
                });
            }

            operation.catch((error) => {
                message.error({ content: `${t('error')}: ${error.message}` });
            });
        }}>
            <Form.Item name="sellAmount" rules={[{ required: true, message: t('buy_product.buy_form.amount.error') }]}>
                <InputNumber min={0} size="large" style={{ width: "100%" }} controls={false}
                    onChange={(value) => { setAmount(parseFloat(value)) }} value={amount}
                    formatter={formatNumber} prefix={productData.productToken.symbol}
                    addonAfter={<Typography.Text>
                        {!isNaN(amount) ?
                            formatNumber(
                                Math.round(((formatBigNumber(productData.price) * amount) + Number.EPSILON) * 100) / 100
                            ) : "0"}$
                    </Typography.Text>}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')} />
            </Form.Item>

            <Form.Item>
                <Radio.Group defaultValue="buy" style={{ display: "flex" }}
                    onChange={(event) => { setOperationType(event.target.value) }}>

                    <Radio.Button value="buy" style={{ width: "100%" }}>
                        {t('buy_product.buy_form.operation.buy')}
                    </Radio.Button>

                    {productData.isLocked ? null :
                        <Radio.Button value="sell" style={{ width: "100%" }}>
                            {t("buy_product.buy_form.operation.sell")}
                        </Radio.Button>}
                </Radio.Group>

                {operationType === "sell" ?
                    <Typography.Text type="danger">
                        {t('buy_product.buy_form.operation.sell_advise.start')}
                        <Typography.Text style={{ cursor: "pointer" }} underline target="_blank" onClick={() => {
                            window.open("https://etherscan.io/directory/Exchanges/DEX");
                        }}>{t('buy_product.buy_form.operation.sell_advise.exchanges')}</Typography.Text>
                    </Typography.Text> : null}
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>{
                    operationType === "buy" ? t('buy_product.buy_form.operation.buy') :
                        t('buy_product.buy_form.operation.sell')
                }</Button>
            </Form.Item>
        </Form>

        {productData.userDebt > 0 ? <Card>
            <Col style={{ display: "flex", flexDirection: "column", alignContent: 'center' }}>
                <Typography.Text style={{ paddingBottom: "0.2em", fontSize: "1.2em" }}>
                    {t('buy_product.user_debt_text')}: {formatBigNumber(productData.userDebt)}$
                </Typography.Text>

                <Typography.Text style={{ paddingBottom: "0.2em", fontSize: "1.2em" }}
                    title="Total debt to the users that is available right now">
                    {t('buy_product.total_available_debt_text')}: {
                        formatBigNumber(productData.totalAvailableDebt)}$
                </Typography.Text>

                <Button type="primary" danger={productData.userDebt.gt(productData.totalAvailableDebt)}
                    onClick={() => {

                        if (productData.userDebt.gt(productData.totalAvailableDebt)) {
                            message.error(t('buy_product.error_debt_exceeded'));
                        } else {
                            retrieveIndexDebt(productData.userDebt);
                        }

                    }}>{t('buy_product.user_debt_claim')}</Button>
            </Col>
        </Card> : null}
    </Fragment>;
}