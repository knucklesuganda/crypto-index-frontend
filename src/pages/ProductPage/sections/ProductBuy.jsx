import { ethers } from "ethers";
import { useState } from 'react';
import { formatBigNumber, formatNumber } from "../../../web3/utils";
import { useTranslation } from "react-i18next";
import {
    sellIndex, buyIndex, retrieveIndexDebt,
    BalanceError, ProductLockedError
} from "../../../web3/contracts/IndexContract";
import { Form, Col, InputNumber, Radio, Button, Typography, message, Card, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";



export function ProductBuySection(props) {
    const { providerData, productData } = props;
    const [inProgress, setInProgress] = useState(false);
    const [operationType, setOperationType] = useState('buy');
    const [amount, setAmount] = useState(0);
    const { t } = useTranslation();

    return <Spin spinning={inProgress} indicator={<LoadingOutlined style={{ fontSize: "2em" }} />}>
        <Form name="productInteractionForm" style={{ minWidth: "20vw " }} autoComplete="off" onFinish={(values) => {
            if(productData.isSettlement){
                message.error(t("buy_product.buy_form.settlement_error"));
                return;
            }

            const amount = ethers.utils.parseEther(values.sellAmount.toString());
            let isBuyOperation = operationType === "buy";
            let operation;

            if (isBuyOperation) {
                operation = buyIndex({
                    amount,
                    providerData,
                    productData,
                    notificationMessage: t('add_token_notification'),
                });
            } else {
                operation = sellIndex({
                    amount,
                    providerData,
                    productData,
                    notificationMessage: t('add_token_notification'),
                });
            }

            setInProgress(true);

            operation.then((transactionHash) => {
                message.info(`
                    ${t('buy_product.buy_form.success_message')}: ${transactionHash}
                `);
                setInProgress(false);
            }).catch((error) => {

                if (error instanceof BalanceError) {
                    let tokenBalance;
                    let tokenSymbol;

                    if(isBuyOperation){
                        tokenBalance = productData.buyToken.balance;
                        tokenSymbol = productData.buyToken.symbol;
                    }else{
                        tokenBalance = productData.productToken.balance;
                        tokenSymbol = productData.productToken.symbol;
                    }

                    message.error({
                        content: `${t('buy_product.buy_form.balance_error')}:
                         ${formatBigNumber(tokenBalance)} ${tokenSymbol} `,
                    });
                } else if (error instanceof ProductLockedError) {
                    message.error({ content: t('buy_product.buy_form.product_locked_error') });
                }

                setInProgress(false);

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

            {productData.isLocked ? null : <Form.Item>
                <Radio.Group defaultValue="buy" style={{ display: "flex" }}
                    onChange={(event) => { setOperationType(event.target.value) }}>

                    <Radio.Button value="buy" style={{ width: "100%" }}>
                        {t('buy_product.buy_form.operation.buy')}
                    </Radio.Button>

                    <Radio.Button value="sell" style={{ width: "100%" }}>
                        {t("buy_product.buy_form.operation.sell")}
                    </Radio.Button>
                </Radio.Group>

                {operationType === "sell" ?
                    <Typography.Text type="danger">
                        {t('buy_product.buy_form.operation.sell_advise.start')}
                        <Typography.Text style={{ cursor: "pointer" }} underline target="_blank" onClick={() => {
                            window.open("https://etherscan.io/directory/Exchanges/DEX");
                        }}>{t('buy_product.buy_form.operation.sell_advise.exchanges')}</Typography.Text>
                    </Typography.Text> : null}
            </Form.Item>}

            <Form.Item>
                <Button htmlType="submit" style={{ width: "100%" }}
                    title={productData.isSettlement ? t('buy_product.buy_form.settlement_error') : null}
                    type={productData.isSettlement ? "danger" : "primary"}>{
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
    </Spin>;
}