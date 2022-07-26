import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { bigNumberToNumber } from "../../../web3/utils";
import { Loading, TokenInput } from "../../../components";
import { LoadingOutlined, FireTwoTone } from "@ant-design/icons";
import { Spin, Form, Button, message, Radio, Row } from "antd";
import { AmountError, BalanceError, NoTokensError } from "../../../web3/contracts/errors";
import { LimitExceededError, SafeMinter, TotalLimitExceededError } from "../../../web3/contracts/safe_token";


export function SafeTokenBuy(props) {
    const { productAddress, providerData, tokenPrice, mintSupply, setIsPriceMatic, isPriceMatic } = props;
    const inputRef = useRef(null);
    const { t } = useTranslation();
    const [isBurn, setIsBurn] = useState(false);
    const [inTransaction, setInTransaction] = useState(false);

    return <Spin spinning={inTransaction} indicator={<LoadingOutlined style={{ fontSize: "2em" }} />}>
        <Row style={{ display: "flex", alignItems: "center" }}>
            <Form onFinish={(values) => {
                const minter = new SafeMinter(productAddress, providerData);
                setInTransaction(true);

                let transactionPromise;
                const amount = values.amount;

                if(isBurn){
                    transactionPromise = minter.burn(amount);
                }else{
                    transactionPromise = minter.mint(amount);
                }

                transactionPromise.then(() => {
                    message.info(t("buy_product.buy_form.success_message"));
                    setInTransaction(false);
                }).catch((error) => {
                    setInTransaction(false);
                    let errorMessage = t("error");

                    if (error instanceof BalanceError) {
                        errorMessage = `${t("buy_product.buy_form.balance_error")}: ${error.balance}`;
                    } else if (error instanceof NoTokensError) {
                        errorMessage = t("buy_product.buy_form.no_tokens_error");
                    } else if (error instanceof AmountError) {
                        errorMessage = t("buy_product.buy_form.amount_error");
                    } else if(error instanceof LimitExceededError){
                        errorMessage = t("buy_product.buy_form.limit_error");
                    }else if(error instanceof TotalLimitExceededError){
                        errorMessage = t("buy_product.buy_form.total_limit_error");
                    }

                    message.error(errorMessage);
                });
            }}>
                {tokenPrice === 0 ? <Loading /> :
                    <TokenInput useAddon inputRef={inputRef} productPrice={tokenPrice}
                        prefixSymbol="SAFE"
                        postfixSymbol={isPriceMatic ? "MATIC" : "USD"}
                        minValue={1}
                        maxValue={mintSupply ? bigNumberToNumber(mintSupply) : null} />}

                <Form.Item style={{ marginBottom: 0, display: "flex" }}>
                    <Radio.Group defaultValue="matic" style={{ display: "flex" }} onChange={(event) => {
                        setIsPriceMatic(event.target.value === "matic");
                    }}>
                        <Radio.Button style={{ width: "100%" }} value="usd">USD</Radio.Button>
                        <Radio.Button style={{ width: "100%" }} value="matic">MATIC</Radio.Button>

                        <Button style={{
                            border: isBurn ? "2px solid #e61b1b" : "",
                            boxShadow: isBurn ? "0px 0px 21px 0px #e61b1b" : "",
                            color: isBurn ? "#e61b1b" : "",
                            marginLeft: "1em",
                            transition: "200ms",
                        }} onClick={() => { setIsBurn(!isBurn) }}>
                            Burn tokens
                            <FireTwoTone twoToneColor={isBurn ? "#e61b1b" : "#177ddc"} />
                        </Button>

                    </Radio.Group>
                </Form.Item>

                <Form.Item style={{ marginTop: "0.8em" }}>
                    <Button htmlType="submit" style={{ width: "100%" }} title="Buy SAFE Token" type="primary">
                        {isBurn ? t("buy_product.token_burn") : t("buy_product.token_buy")}
                    </Button>
                </Form.Item>
            </Form>

        </Row>
    </Spin>;
}
