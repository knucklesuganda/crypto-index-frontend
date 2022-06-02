import { ethers } from "ethers";
import { useState } from 'react';
import { convertToBigNumber, formatBigNumber, formatNumber } from "../../../web3/utils";
import { useTranslation } from "react-i18next";
import {
    sellIndex,
    buyIndex,
    retrieveIndexDebt, 
    BalanceError,
    ProductSettlementError,
 } from "../../../web3/contracts/IndexContract";
import { Form, Col, Radio, Row, Button, Typography, Collapse, message, Avatar, Spin } from "antd";
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { LoadingOutlined } from "@ant-design/icons";
import { TokenInput } from "../../../components/TokenInput";
import { addTokenNotification } from "../../../components";
import { parseEther } from "ethers/lib/utils";


function DebtSection(props) {
    const {
        providerData, userDebt, isBuyDebt, totalDebt,
        sectionSymbol, changeProgress, productData,
    } = props;
    const { t } = useTranslation();
    const [amount, setAmount] = useState(0);

    return <Col style={{ display: "flex", flexDirection: "column", alignContent: 'center' }}>
        <Typography.Text style={{ paddingBottom: "0.2em", fontSize: "1.2em" }}
            title={t('buy_product.total_available_debt_hint')}>
                {t('buy_product.total_available_debt_text')}: {formatBigNumber(totalDebt, 6)} {sectionSymbol}
        </Typography.Text>

        <Typography.Text style={{ paddingBottom: "0.2em", fontSize: "1.2em" }}>
            {t('buy_product.user_debt_text')}: {formatBigNumber(userDebt, 6)} {sectionSymbol}
        </Typography.Text>

        <Col style={{ marginTop: "0.4em", marginBottom: "0.4em" }}>
            <Form onFinish={(values) => {
                const realAmount = ethers.BigNumber.from(ethers.utils.parseEther(values.amount.toString()));

                if (realAmount.gt(totalDebt)) {
                    message.error(t('buy_product.error_debt_exceeded'));
                } else {
                    changeProgress(true);

                    retrieveIndexDebt({
                        providerData,
                        amount: realAmount,
                        productAddress: productData.address,
                        isSettlement: productData.isSettlement,
                        isBuyDebt: isBuyDebt,
                    }).then(() => {
                        addTokenNotification({
                            providerData,
                            token: productData.productToken,
                            message: t('add_token_notification'),
                            productName: productData.name,
                        });
                        changeProgress(false);
                    }).catch(error => {
                        changeProgress(false);
                        let errorMessage = t('error');

                        if (error instanceof ProductSettlementError) {
                            errorMessage = t('buy_product.error_product_settlement');
                        }

                        message.error(errorMessage);
                    });
                }
            }}>
                <TokenInput
                    prefixSymbol={isBuyDebt ? productData.productToken.symbol : productData.buyToken.symbol}
                    productPrice={productData.price} inputValue={amount}
                    setInputValue={setAmount}
                    maxValue={formatBigNumber(userDebt)}
                    useAddon={isBuyDebt} />

                <Button htmlType="submit" type="primary" danger={
                    productData.isSettlement || totalDebt.eq(0)
                } style={{ width: "100%" }}>{t('buy_product.user_debt_claim')}</Button>
            </Form>
        </Col>

    </Col>;
}


function DebtSectionCollapse(props) {
    const { sectionTitle, sectionIcon, debt } = props;

    if(debt.eq(0)) { return null; }

    return <Col>
        <Collapse defaultActiveKey={['1']} bordered={false} style={{ width: "25em", marginLeft: "1em" }}>
            <Collapse.Panel key="1" header={
                <Row>
                    <Typography.Text style={{
                        fontWeight: "300", fontSize: "1.4em", marginRight: "0.5em",
                    }}>{sectionTitle}</Typography.Text>

                    <Avatar shape="circle" style={{ backgroundColor: "#303030" }} icon={sectionIcon} />
                </Row>
            }>{props.children}</Collapse.Panel>
        </Collapse>
    </Col>;
}


export function ProductBuySection(props) {
    const { providerData, productData } = props;
    const [inProgress, setInProgress] = useState(false);
    const [operationType, setOperationType] = useState('buy');
    const [amount, setAmount] = useState(0);
    const { t } = useTranslation();

    return <Spin spinning={inProgress} indicator={<LoadingOutlined style={{ fontSize: "2em" }} />}>
        <Col style={{ display: "flex", justifyContent: "center" }}>
            <Form name="productInteractionForm" style={{ minWidth: "20vw" }} autoComplete="off" onFinish={(values) => {
                const weiAmount = parseEther(values.amount.toString());

                if (productData.isSettlement) {
                    message.error(t("buy_product.buy_form.settlement_error"));
                    return;
                }else if(productData.availableLiquidity.lt(weiAmount)){
                    message.error(t("buy_product.buy_form.liquidity_error"));
                    return;
                }

                let isBuyOperation = operationType === "buy";
                let operationPromise;

                if (isBuyOperation) {
                    operationPromise = buyIndex({
                        providerData,
                        productData,
                        approveAmount: productData.price.mul(convertToBigNumber(values.amount)).div(convertToBigNumber(1)),
                        amount: weiAmount,
                        notificationMessage: t('add_token_notification'),
                    });
                } else {
                    operationPromise = sellIndex({ amount: weiAmount, providerData, productData });
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

                        errorMessage = `${t('buy_product.buy_form.balance_error')}: ${
                            formatNumber(formatBigNumber(tokenBalance))}
                     ${tokenSymbol}`;

                    }else {
                        errorMessage = `${t("error")}: ${error.message}`;
                    }

                    setInProgress(false);
                    message.error({ content: errorMessage });
                });

            }}>
                <TokenInput useAddon
                    maxValue={formatBigNumber(productData.availableLiquidity)}
                    productPrice={productData.price}
                    productSymbol={productData.productToken.symbol}
                    setInputValue={setAmount}
                    inputValue={amount}
                    prefixSymbol={productData.productToken.symbol} />

                <Form.Item>
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
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit" style={{ width: "100%" }}
                        title={productData.isSettlement ? t('buy_product.buy_form.settlement_error') : null}
                        type={productData.isSettlement ? "danger" : "primary"}>{
                            operationType === "buy" ?
                                t('buy_product.buy_form.operation.buy') : t('buy_product.buy_form.operation.sell')
                        }</Button>
                </Form.Item>
            </Form>
        </Col>

        <Row justify="space-around">
            <DebtSectionCollapse sectionIcon={<RiseOutlined />}
                sectionTitle={t('buy_product.buy_debt')}
                debt={productData.userBuyDebt}>
                    <DebtSection providerData={providerData}
                        userDebt={productData.userBuyDebt}
                        totalDebt={productData.totalBuyDebt}
                        sectionSymbol={productData.productToken.symbol}
                        productData={productData} isBuyDebt={true}
                    changeProgress={setInProgress} />
            </DebtSectionCollapse>

            <DebtSectionCollapse sectionIcon={<FallOutlined />}
                sectionTitle={t('buy_product.sell_debt')}
                debt={productData.userSellDebt}>
                    <DebtSection providerData={providerData}
                        userDebt={productData.userSellDebt}
                        totalDebt={productData.totalSellDebt}
                        sectionSymbol="$" productData={productData}
                        isBuyDebt={false} changeProgress={setInProgress} />
            </DebtSectionCollapse>
        </Row>

    </Spin>;
}