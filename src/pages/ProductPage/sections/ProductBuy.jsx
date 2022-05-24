import { ethers } from "ethers";
import { useState } from 'react';
import { formatBigNumber } from "../../../web3/utils";
import { useTranslation } from "react-i18next";
import {
    sellIndex, buyIndex, retrieveIndexDebt,
    BalanceError, ProductLockedError, ProductSettlementError,
} from "../../../web3/contracts/IndexContract";
import { Form, Col, Radio, Row, Button, Typography, message, Card, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { TokenInput } from "../../../components/TokenInput";
import { addTokenNotification } from "../../../components";
import { parseEther } from "ethers/lib/utils";


function DebtSection(props) {
    const {providerData, userDebt, totalDebt, changeProgress, sectionSymbol, productData, sectionTitle} = props;
    const { t } = useTranslation();
    const [amount, setAmount] = useState(0);

    if (userDebt.eq(0)) {
        return null;
    }

    return <Card title={sectionTitle}>
        <Col style={{ display: "flex", flexDirection: "column", alignContent: 'center' }}>
            <Typography.Text style={{ paddingBottom: "0.2em", fontSize: "1.2em" }}>
                {t('buy_product.user_debt_text')}: {formatBigNumber(userDebt, 6)} {sectionSymbol}
            </Typography.Text>

            <Typography.Text style={{ paddingBottom: "0.2em", fontSize: "1.2em" }}
                title="Total debt to the users that is available right now">
                {t('buy_product.total_available_debt_text')}: {formatBigNumber(totalDebt, 6)} {sectionSymbol}
            </Typography.Text>

            <Col style={{ marginTop: "0.4em", marginBottom: "0.4em" }}>
                <Form onFinish={(values) => {
                    const realAmount = ethers.BigNumber.from(ethers.utils.parseEther(values.amount.toString()));

                    if (realAmount.gt(totalDebt)) {
                        message.error(t('buy_product.error_debt_exceeded'));
                    } else {

                        changeProgress();

                        retrieveIndexDebt({
                            providerData,
                            amount: realAmount,
                            productAddress: productData.address,
                            isLocked: productData.isLocked,
                            isSettlement: productData.isSettlement,
                        }).then(() => {
                            addTokenNotification({
                                providerData,
                                token: productData.token,
                                message: t('add_token_notification'),
                                productName: productData.name,
                            });
                        }).catch(error => {
                            let errorMessage;

                            if (error instanceof ProductLockedError) {
                                errorMessage = t('buy_product.error_product_locked');
                            } else if (error instanceof ProductSettlementError) {
                                errorMessage = t('buy_product.error_product_settlement');
                            }

                            message.error(errorMessage);
                        }).finally(() => {
                            changeProgress();
                        });

                    }

                }}>
                    <TokenInput productPrice={productData.price} productSymbol={sectionSymbol}
                        inputValue={amount} setInputValue={setAmount} />

                    <Button htmlType="submit" type="primary" danger={productData.isSettlement} style={{ width: "100%" }}>
                        {t('buy_product.user_debt_claim')}
                    </Button>
                </Form>
            </Col>

        </Col>
    </Card>;
}


export function ProductBuySection(props) {
    const { providerData, productData } = props;
    const [inProgress, setInProgress] = useState(false);
    const [operationType, setOperationType] = useState('buy');
    const [amount, setAmount] = useState(0);
    const { t } = useTranslation();

    return <Spin spinning={inProgress} indicator={<LoadingOutlined style={{ fontSize: "2em" }} />}>
        <Form name="productInteractionForm" style={{ minWidth: "20vw " }} autoComplete="off" onFinish={(values) => {
            if (productData.isSettlement) {
                message.error(t("buy_product.buy_form.settlement_error"));
                return;
            }

            let isBuyOperation = operationType === "buy";
            let operationPromise;

            if (isBuyOperation) {
                operationPromise = buyIndex({
                    providerData,
                    productData,
                    approveAmount: productData.price.mul(values.amount),
                    amount: parseEther(values.amount.toString()),
                    notificationMessage: t('add_token_notification'),
                });
            } else {
                operationPromise = sellIndex({ amount, providerData, productData });
            }

            setInProgress(true);

            operationPromise.then((transactionHash) => {
                message.info(`${t('buy_product.buy_form.success_message')}: ${transactionHash}`);
                setInProgress(false);
            }).catch((error) => {
                let errorMessage;

                if (error instanceof BalanceError) {
                    let tokenBalance;
                    let tokenSymbol;

                    if (isBuyOperation) {
                        tokenBalance = productData.buyToken.balance;
                        tokenSymbol = productData.buyToken.symbol;
                    } else {
                        tokenBalance = productData.productToken.balance;
                        tokenSymbol = productData.productToken.symbol;
                    }

                    errorMessage = `${t('buy_product.buy_form.balance_error')}: ${formatBigNumber(tokenBalance)}
                     ${tokenSymbol}`;
                } else if (error instanceof ProductLockedError) {
                    errorMessage = t('buy_product.buy_form.product_locked_error');
                } else {
                    errorMessage = `Error: ${error.message}`;
                }

                setInProgress(false);
                message.error({ content: errorMessage });
            });

        }}>
            <TokenInput productPrice={productData.price} productSymbol={productData.productToken.symbol}
                inputValue={amount} setInputValue={setAmount} />

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

        <Row style={{ width: "100%" }}>
            <DebtSection sectionTitle="Buy debt"
                providerData={providerData}
                userDebt={productData.userBuyDebt}
                totalDebt={productData.totalBuyDebt}
                sectionSymbol={productData.productToken.symbol}
                productData={productData}
                changeProgress={() => { setInProgress(!inProgress); }}
            />

            <DebtSection sectionTitle="Sell debt"
                providerData={providerData}
                userDebt={productData.userSellDebt}
                totalDebt={productData.totalSellDebt}
                sectionSymbol="$"
                changeProgress={() => { setInProgress(!inProgress); }}
            />
        </Row>
    </Spin>;
}