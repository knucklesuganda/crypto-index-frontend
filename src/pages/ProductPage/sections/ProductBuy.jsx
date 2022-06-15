import { ethers } from "ethers";
import { useState, useRef } from 'react';
import { convertToBigNumber, formatBigNumber, formatNumber } from "../../../web3/utils";
import { useTranslation } from "react-i18next";
import {
    sellIndex,
    buyIndex,
    retrieveIndexDebt,
    BalanceError,
    ProductSettlementError,
} from "../../../web3/contracts/IndexContract";
import { Form, Col, Radio, Row, Button, Typography, Collapse, message, Avatar, Spin, Modal } from "antd";
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { LoadingOutlined } from "@ant-design/icons";
import { TokenInput } from "../../../components/TokenInput";
import { addTokenNotification } from "../../../components";
import { parseEther } from "ethers/lib/utils";
import { OnlyDesktop } from "../../../components/MediaQuery";


function DebtSection(props) {
    const {
        providerData, userDebt, isBuyDebt, totalDebt,
        sectionSymbol, changeProgress, productData,
    } = props;
    const { t } = useTranslation();
    const inputRef = useRef(null);

    return <Col style={{ display: "flex", flexDirection: "column", alignContent: 'center' }}>
        <Typography.Text style={{ paddingBottom: "0.2em", fontSize: "1.2em" }}
            title={t('buy_product.total_available_debt_hint')}>
            {t('buy_product.total_available_debt_text')}: {formatBigNumber(totalDebt, 6)} {sectionSymbol}
        </Typography.Text>

        <Col style={{ fontSize: "1.2em", paddingBottom: "0.2em" }}>
            <Typography.Text>
                {t('buy_product.user_debt_text')}: {formatBigNumber(userDebt, 6)} {sectionSymbol}
            </Typography.Text>
        </Col>

        <Col style={{ marginTop: "0.4em", marginBottom: "0.4em" }}>
            <Form onFinish={(values) => {
                if(values.amount === 0){
                    return;
                }

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
                        if (isBuyDebt) {
                            addTokenNotification({
                                providerData,
                                token: productData.productToken,
                                message: t('add_token_notification'),
                                productName: productData.name,
                            });
                        }
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
                    productPrice={productData.price}
                    postfixSymbol={productData.buyToken.symbol}
                    maxValue={formatBigNumber(userDebt)}
                    useAddon={isBuyDebt} inputRef={inputRef} />

                <Button htmlType="submit" type="primary" danger={
                    productData.isSettlement || totalDebt.eq(0)
                } style={{ width: "100%" }}>{t('buy_product.user_debt_claim')}</Button>
            </Form>
        </Col>

    </Col>;
}


function DebtSectionCollapse(props) {
    const { sectionTitle, sectionIcon, debt } = props;

    if (debt.eq(0)) { return null; }

    return <Col>
        <Collapse defaultActiveKey={['1']} bordered={false} style={{ width: "30em", marginLeft: "1em" }}>
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


function createProductAlert(name) {
    if (!localStorage.acceptedAlert) {
        Modal.warning({
            title: "READ BEFORE BUYING",
            okText: "I hereby agree",
            onOk: () => {
                localStorage.acceptedAlert = true;
            },
            content: <Col>
                <Typography.Text style={{ fontSize: "1.2em" }}>
                    '{name}' is a product that is actively being developed.
                </Typography.Text>
                <br /><br />

                <Typography.Text style={{ fontSize: "1.2em", fontWeight: "bold" }} type="danger">
                    YOU WILL NOT RECEIVE YOUR FUNDS BACK ONCE YOU MAKE THE TRANSACTION.<br /><br />
                    WE WILL NOT RUN THE SETTLEMENT PROCESS UNTIL WE HAVE ENOUGH FEES FOR ALL THE TRANSACTIONS 
                    ON ETHEREUM NETWORK, AND SETTLEMENT PROCESS WILL BE STOPPED ONCE NEW VERSION OF THE PROTOCOL 
                    IS RELEASED(YOU WILL BE NOTIFIED OF SUCH CHANGES BEFOREHAND).
                    <br /><br />

                    BY BUYING THIS PRODUCT, 
                    YOU AGREE THAT YOU ACCEPT AND BARE FULL RESPONSIBILITY AND TAKE ALL 
                    RISKS FOR YOUR ACTIONS AND DECISIONS.<br /><br />
                </Typography.Text>
            </Col>
        });
        return true;
    }

    return false;
}


export function ProductBuySection(props) {
    const { providerData, productData } = props;
    const [inProgress, setInProgress] = useState(false);
    const [operationType, setOperationType] = useState('buy');
    const { t } = useTranslation();

    return <Spin spinning={inProgress} indicator={<LoadingOutlined style={{ fontSize: "2em" }} />}>
        <Col style={{ display: "flex", justifyContent: "center", zIndex: 100 }}>
            <Form name="productInteractionForm" style={{ minWidth: "20vw" }} autoComplete="off" onFinish={(values) => {
                if (createProductAlert(productData.name)) {
                    return;
                }else if (values.amount === 0 || values.amount < 0.00001) {
                    message.error(t("buy_product.buy_form.amount_error"));
                    return;
                }

                const weiAmount = parseEther(values.amount.toString());
                let isBuyOperation = operationType === "buy";
                let operationPromise;

                if (productData.isSettlement) {
                    message.error(t("buy_product.buy_form.settlement_error"));
                    return;
                } else if (
                    productData.availableLiquidity.lt(weiAmount) 
                    || productData.totalManagedTokens.gte(productData.availableLiquidity)
                ) {
                    message.error(t("buy_product.buy_form.liquidity_error"));
                    return;
                } else if (isBuyOperation && productData.availableTokens.lt(weiAmount)) {
                    message.error(t("buy_product.buy_form.no_tokens_error"));
                    return;
                }

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

                        errorMessage = `${t('buy_product.buy_form.balance_error')}: 
                        ${formatNumber(formatBigNumber(tokenBalance))} ${tokenSymbol}`;

                    } else {
                        errorMessage = `${t("error")}: ${error.message}`;
                    }

                    setInProgress(false);
                    message.error({ content: errorMessage });
                });

            }}>
                <TokenInput
                    useAddon
                    postfixSymbol={productData.buyToken.symbol}
                    maxValue={formatBigNumber(productData.availableLiquidity)}
                    minValue={0.00001}
                    productPrice={productData.price}
                    productSymbol={productData.productToken.symbol}
                    prefixSymbol={productData.productToken.symbol}
                />

                <Form.Item style={{ marginBottom: "0.4em" }}>
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
                        </Typography.Text> : 

                        <Typography.Link style={{ fontSize: "1.1em", textDecoration: "underline" }}
                            type="success" href="https://app.uniswap.org/#/swap?chain=mainnet" target="_blank">

                            {t("buy_product.token_buy")} {productData.buyToken.symbol} {t("buy_product.token_buy_here")}
                        </Typography.Link>}
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit" style={{ width: "100%" }}
                        title={productData.isSettlement ? t('buy_product.buy_form.settlement_error') : null}
                        type={productData.isSettlement ? "danger" : "primary"}>
                        {operationType === "buy" ?
                            t('buy_product.buy_form.operation.buy') : t('buy_product.buy_form.operation.sell')}
                    </Button>
                </Form.Item>
            </Form>
        </Col>

        <Row justify="space-around">
            <DebtSectionCollapse sectionIcon={<RiseOutlined />}
                sectionTitle={t('buy_product.buy_debt')} debt={productData.userBuyDebt}>
                <DebtSection providerData={providerData}
                    userDebt={productData.userBuyDebt}
                    totalDebt={productData.totalBuyDebt}
                    sectionSymbol={productData.productToken.symbol}
                    productData={productData} isBuyDebt={true}
                    changeProgress={setInProgress} />
            </DebtSectionCollapse>

            <DebtSectionCollapse sectionIcon={<FallOutlined />}
                sectionTitle={t('buy_product.sell_debt')} debt={productData.userSellDebt}>
                <DebtSection providerData={providerData}
                    userDebt={productData.userSellDebt}
                    totalDebt={productData.totalSellDebt}
                    sectionSymbol={productData.buyToken.symbol}
                    productData={productData}
                    isBuyDebt={false} changeProgress={setInProgress} />
            </DebtSectionCollapse>
        </Row>

        <OnlyDesktop>
            <Col style={{
                position: "absolute",
                zIndex: 1,
                top: "0.5em",
                right: "70%",
                width: "30em",
                border: "1px solid #0a0a0a",
                padding: "0.2em",
            }}>
                <Typography.Text style={{ fontSize: "1.2em" }} title={t("buy_product.analytics.balance_hint")}>
                    {t('buy_product.analytics.balance')}: {formatBigNumber(props.productData.productToken.balance)} {
                        props.productData.productToken.symbol}
                </Typography.Text>
            </Col>
        </OnlyDesktop>
    </Spin>;
}