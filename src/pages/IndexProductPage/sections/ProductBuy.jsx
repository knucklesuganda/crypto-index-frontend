import settings from "../../../settings";
import { useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { addTokenNotification, TokenInput } from "../../../components";
import { OnlyDesktop, useMobileQuery } from "../../../components/MediaQuery";
import { LoadingOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { convertToEther, formatBigNumber, formatNumber } from "../../../web3/utils";
import { Form, Col, Radio, Row, Button, Typography, Collapse, message, Avatar, Spin, Modal } from "antd";
import {
    DebtExceededError, LiquidityError, NoTokensError, ProductSettlementError, BalanceError, AmountError,
} from "../../../web3/contracts/index/index";


function DebtSection(props) {
    const { providerData, isBuyDebt, changeProgress, productData, product } = props;
    const { t } = useTranslation();
    const inputRef = useRef(null);

    const userDebt = isBuyDebt ? productData.userBuyDebt : productData.userSellDebt;
    const totalDebt = isBuyDebt ? productData.totalBuyDebt : productData.totalSellDebt;
    const sectionSymbol = isBuyDebt ? productData.productToken.symbol : productData.buyToken.symbol;

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
                changeProgress(true);

                product.retrieveDebt(values.amount, isBuyDebt).then(() => {

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
                    } else if (error instanceof DebtExceededError) {
                        errorMessage = t('buy_product.error_debt_exceeded');
                    }

                    message.error(errorMessage);
                });

            }}>
                <TokenInput prefixSymbol={sectionSymbol}
                    productPrice={productData.price}
                    postfixSymbol={productData.buyToken.symbol}
                    maxValue={formatBigNumber(userDebt)}
                    useAddon={isBuyDebt} inputRef={inputRef} />

                <Button htmlType="submit" type="primary" danger={productData.isSettlement || totalDebt.eq(0)}
                    style={{ width: "100%" }}>{t('buy_product.user_debt_claim')}</Button>
            </Form>
        </Col>

    </Col>;
}


function DebtSectionCollapse(props) {
    const { sectionTitle, sectionIcon, debt } = props;
    const isMobile = useMobileQuery();

    if (debt.eq(0)) { return null; }

    return <Col>
        <Collapse defaultActiveKey={['1']} bordered={false} style={{
            width: isMobile ? "25em" : "30em",
            marginLeft: "1em",
        }}>
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
    const { providerData, productData, product } = props;
    const [inProgress, setInProgress] = useState(false);
    const [operationType, setOperationType] = useState(false);
    const { t } = useTranslation();

    return <Spin spinning={inProgress} indicator={<LoadingOutlined style={{ fontSize: "2em" }} />}>
        <Col style={{ display: "flex", justifyContent: "center", zIndex: 100 }}>
            <Form name="productInteractionForm" style={{ minWidth: "20vw" }} autoComplete="off"
                onFinish={(values) => {
                    if (createProductAlert(productData.name)) {
                        return;
                    }

                    const amount = values.amount;
                    const productPrice = productData.price;

                    let operationPromise;
                    setInProgress(true);

                    if (operationType) {
                        operationPromise = product.buy(
                            convertToEther(amount).mul(productPrice).div(convertToEther(1)), amount,
                        );
                    } else {
                        operationPromise = product.sell(amount);
                    }

                    operationPromise.then((transactionHash) => {
                        message.info(`${t('buy_product.buy_form.success_message')}: ${transactionHash}`);
                        setInProgress(false);
                    }).catch((error) => {
                        let errorMessage;

                        if (error instanceof BalanceError) {
                            let tokenBalance;
                            let tokenSymbol;

                            if (operationType) {
                                tokenBalance = productData.buyToken.balance;
                                tokenSymbol = productData.buyToken.symbol;
                            } else {
                                tokenBalance = productData.productToken.balance;
                                tokenSymbol = productData.productToken.symbol;
                            }

                            errorMessage = `${t('buy_product.buy_form.balance_error')}: 
                                ${formatNumber(formatBigNumber(tokenBalance))} ${tokenSymbol}`;

                        } else if (error instanceof AmountError) {
                            errorMessage = t("buy_product.buy_form.amount_error");
                        } else if (error instanceof ProductSettlementError) {
                            errorMessage = t("buy_product.buy_form.settlement_error");
                        } else if (error instanceof LiquidityError) {
                            errorMessage = t("buy_product.buy_form.liquidity_error");
                        } else if (error instanceof NoTokensError) {
                            errorMessage = t("buy_product.buy_form.no_tokens_error");
                        } else {
                            errorMessage = `${t("error")}: ${error.message}`;
                        }

                        setInProgress(false);
                        message.error(errorMessage);
                    });

                }}>

                <TokenInput useAddon
                    minValue={0.00001}
                    productPrice={productData.price}
                    postfixSymbol={productData.buyToken.symbol}
                    maxValue={formatBigNumber(productData.availableLiquidity)}
                    productSymbol={productData.productToken.symbol}
                    prefixSymbol={productData.productToken.symbol}
                />

                <Form.Item style={{ marginBottom: "0.4em" }}>
                    <Radio.Group defaultValue="buy" style={{ display: "flex" }}
                        onChange={(event) => {

                            if (event.target.value === "buy") {
                                setOperationType(true);
                            } else {
                                setOperationType(false);
                            }

                        }}>

                        <Radio.Button value="buy" style={{ width: "100%" }}>
                            {t('buy_product.buy_form.operation.buy')}
                        </Radio.Button>

                        <Radio.Button value="sell" style={{ width: "100%" }}>
                            {t("buy_product.buy_form.operation.sell")}
                        </Radio.Button>

                    </Radio.Group>

                    {!operationType ?
                        <Typography.Text type="danger">
                            {t('buy_product.buy_form.operation.sell_advise.start')}
                            <Typography.Text style={{ cursor: "pointer" }} underline target="_blank" onClick={() => {
                                window.open("https://etherscan.io/directory/Exchanges/DEX");
                            }}>{t('buy_product.buy_form.operation.sell_advise.exchanges')}</Typography.Text>
                        </Typography.Text> :

                        <Typography.Link style={{ fontSize: "1.1em", textDecoration: "underline" }}
                            type="success" href={settings.BUY_DAI_LINK} target="_blank">

                            {t("buy_product.token_buy")} {productData.buyToken.symbol} {t("buy_product.token_buy_here")}
                        </Typography.Link>}
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit" style={{ width: "100%" }}
                        title={productData.isSettlement ? t('buy_product.buy_form.settlement_error') : null}
                        type={productData.isSettlement ? "danger" : "primary"}>
                        {operationType ? t('buy_product.buy_form.operation.buy')
                            : t('buy_product.buy_form.operation.sell')}
                    </Button>
                </Form.Item>
            </Form>
        </Col>

        <Row justify="space-around">
            <DebtSectionCollapse sectionIcon={<RiseOutlined />}
                sectionTitle={t('buy_product.buy_debt')} debt={productData.userBuyDebt}>

                <DebtSection isBuyDebt product={product} providerData={providerData}
                    userDebt={productData.userBuyDebt}
                    totalDebt={productData.totalBuyDebt}
                    sectionSymbol={productData.productToken.symbol}
                    productData={productData}
                    changeProgress={setInProgress} />
            </DebtSectionCollapse>

            <DebtSectionCollapse sectionIcon={<FallOutlined />}
                sectionTitle={t('buy_product.sell_debt')} debt={productData.userSellDebt}>

                <DebtSection product={product} providerData={providerData}
                    userDebt={productData.userSellDebt}
                    totalDebt={productData.totalSellDebt}
                    sectionSymbol={productData.buyToken.symbol}
                    productData={productData}
                    changeProgress={setInProgress} />
            </DebtSectionCollapse>
        </Row>

        <OnlyDesktop>
            <Col style={{
                position: "absolute",
                zIndex: 1,
                top: "0.5em",
                right: "70%",
                width: "30em",
                padding: "0.2em",
            }}>
                <Typography.Text style={{ fontSize: "1.2em" }} title={t("buy_product.analytics.balance_hint")}>
                    {t('buy_product.analytics.balance')}: {
                        formatBigNumber(productData.productToken.balance)} {productData.productToken.symbol}
                </Typography.Text>
            </Col>
        </OnlyDesktop>
    </Spin>;
}
