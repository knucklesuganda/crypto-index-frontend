import { ethers } from "ethers";
import { useState } from 'react';
import { formatBigNumber } from "../../../web3/utils";
import { useTranslation } from "react-i18next";
import { sellIndex, buyIndex, retrieveIndexDebt, BalanceError, 
    ProductLockedError, ProductSettlementError, addIndexFee } from "../../../web3/contracts/IndexContract";
import { Form, Col, Radio, Row, Button, Typography, message, Card, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { TokenInput } from "../../../components/TokenInput";


function DebtSection(props){
    const {
        userDebt, totalDebt, productAddress, isLocked, productPrice,
        isSettlement, providerData, sectionTitle, sectionSymbol, productFee,
    } = props;
    const { t } = useTranslation();
    const [amount, setAmount] = useState(0);

    if(userDebt.eq(0)){ return null; }

    return <Card title={sectionTitle}>
        <Col style={{ display: "flex", flexDirection: "column", alignContent: 'center' }}>
            <Typography.Text style={{ paddingBottom: "0.2em", fontSize: "1.2em" }}>
                {t('buy_product.user_debt_text')}: {formatBigNumber(userDebt)} {sectionSymbol}
            </Typography.Text>

            <Typography.Text style={{ paddingBottom: "0.2em", fontSize: "1.2em" }}
                title="Total debt to the users that is available right now">
                {t('buy_product.total_available_debt_text')}: {formatBigNumber(totalDebt)} {sectionSymbol}
            </Typography.Text>

            <Col style={{ marginTop: "0.4em", marginBottom: "0.4em" }}>
                <TokenInput productPrice={productPrice} productFee={productFee}
                    productSymbol={sectionSymbol} inputValue={amount} setInputValue={setAmount} />
            </Col>

            <Button type="primary" danger={userDebt.eq(0)}
                onClick={() => {

                    if (userDebt.gt(totalDebt)) {
                        message.error(t('buy_product.error_debt_exceeded'));
                    } else {
                        retrieveIndexDebt({
                            amount: userDebt, productAddress, isLocked, providerData, isSettlement,
                        }).catch(error => {

                            if(error instanceof ProductLockedError){
                                message.error(t('buy_product.error_product_locked'));
                            }else if(error instanceof ProductSettlementError){
                                message.error(t('buy_product.error_product_settlement'));
                            }

                        });
                    }

                }}>{t('buy_product.user_debt_claim')}</Button>
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
            if(productData.isSettlement){
                message.error(t("buy_product.buy_form.settlement_error"));
                return;
            }

            const amountWithFee = ethers.utils.parseEther(
                addIndexFee(formatBigNumber(productData.price), productData.fee, values.amount).toString()
            );
            let isBuyOperation = operationType === "buy";
            let operationPromise;

            if (isBuyOperation) {
                operationPromise = buyIndex({
                    amount: amountWithFee.mul(ethers.BigNumber.from('10').pow(18)).div(productData.price),
                    providerData,
                    productData,
                    approveAmount: amountWithFee,
                    notificationMessage: t('add_token_notification'),
                });
            } else {
                operationPromise = sellIndex({amount, providerData, productData});
            }

            setInProgress(true);

            operationPromise.then((transactionHash) => {
                message.info(`
                    ${t('buy_product.buy_form.success_message')}: ${transactionHash}
                `);
                setInProgress(false);
            }).catch((error) => {
                let errorMessage;

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

                    errorMessage = `${t('buy_product.buy_form.balance_error')}: ${formatBigNumber(tokenBalance)}
                     ${tokenSymbol}`;
                } else if (error instanceof ProductLockedError) {
                    errorMessage = t('buy_product.buy_form.product_locked_error');
                }else{
                    errorMessage = `Error: ${error.message}`;
                }

                errorMessage.error({ content: errorMessage });
                setInProgress(false);
            });

        }}>
            <Form.Item name="amount" rules={[{
                required: true, message: t('buy_product.buy_form.amount.error'),
            }]}>
                <TokenInput productPrice={productData.price}
                    productFee={productData.fee}
                    productSymbol={productData.productToken.symbol}
                    inputValue={amount} setInputValue={setAmount} />
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

        <Row style={{ width: "100%" }}>
            <DebtSection sectionTitle="Buy debt"
                productAddress={productData.address}
                isLocked={productData.isLocked}
                providerData={providerData}
                userDebt={productData.userBuyDebt}
                totalDebt={productData.totalBuyDebt}
                isSettlement={productData.isSettlement}
                sectionSymbol={productData.productToken.symbol}
                productFee={productData.fee}
                productPrice={productData.price}
            />
            <DebtSection sectionTitle="Sell debt"
                productAddress={productData.address}
                isLocked={productData.isLocked}
                providerData={providerData}
                userDebt={productData.userSellDebt}
                totalDebt={productData.totalSellDebt}
                isSettlement={productData.isSettlement}
                sectionSymbol="$"
                productFee={productData.fee}
                productPrice={productData.price}
            />
        </Row>
    </Spin>;
}