import { SafeMinter } from "../../../web3/contracts/safe_token";
import { Loading, TokenInput } from "../../../components";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Form, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { bigNumberToNumber } from "../../../web3/utils";
import { AmountError, BalanceError, NoTokensError } from "../../../web3/contracts/errors";


export function SafeTokenBuy(props) {
    const { productAddress, providerData, tokenPrice, mintSupply } = props;
    const inputRef = useRef(null);
    const { t } = useTranslation();
    const [isBuy, setIsBuy] = useState(false);

    return <Spin spinning={isBuy} indicator={<LoadingOutlined style={{ fontSize: "2em" }} />}>
        <Form onFinish={(values) => {
            const minter = new SafeMinter(productAddress, providerData);
            message.info(t("wallet.confirm_transaction"));

            minter.mint(values.amount).then(() => {

                message.info(t("buy_product.buy_form.success_message"));
                setIsBuy(false);

            }).catch((error) => {
                setIsBuy(false);
                let errorMessage = t("error");

                if(error instanceof BalanceError){
                    errorMessage = t("buy_product.buy_form.balance_error");
                }else if(error instanceof NoTokensError){
                    errorMessage = t("buy_product.buy_form.no_tokens_error");
                }else if(error instanceof AmountError){
                    errorMessage = t("buy_product.buy_form.amount_error");
                }

                message.error(errorMessage);
            });

            setIsBuy(true);
        }}>
            {tokenPrice === 0 ? <Loading /> :
                <TokenInput useAddon
                    inputRef={inputRef} productPrice={tokenPrice}
                    prefixSymbol="SAFE" postfixSymbol="USD"
                    minValue={1} maxValue={mintSupply ? bigNumberToNumber(mintSupply) : null} />}

            <Form.Item style={{ marginTop: "0.8em" }}>
                <Button htmlType="submit" style={{ width: "100%" }} title="Buy SAFE Token" type="primary">
                    {t("buy_product.token_buy")}
                </Button>
            </Form.Item>
        </Form>
    </Spin>;
}
