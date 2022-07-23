import { SafeMinter } from "../../../web3/contracts/safe_token";
import { Loading, TokenInput } from "../../../components";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Form, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";


export function SafeTokenBuy(props) {
    const { productAddress, providerData, tokenPrice, mintSupply } = props;
    const inputRef = useRef(null);
    const { t } = useTranslation();
    const [isBuy, setIsBuy] = useState(false);

    return <Spin spinning={isBuy} indicator={<LoadingOutlined style={{ fontSize: "2em" }} />}>
        <Form onFinish={(values) => {
            const minter = new SafeMinter(productAddress, providerData);
            message.info("wallet.confirm_transaction");

            minter.mint(values.amount).then(() => {
                message.info(`Successfully minted ${values.amount} SAFE tokens`);
            }).catch((error) => {
                setIsBuy(false);
                message.error(error.toString());
            });

            setIsBuy(true);
        }}>
            {tokenPrice === 0 ? <Loading /> :
                <TokenInput useAddon inputRef={inputRef} productPrice={tokenPrice}
                    prefixSymbol="SAFE" postfixSymbol="USD"
                    minValue={1} maxValue={mintSupply ? '0' : mintSupply} />}

            <Form.Item style={{ marginTop: "0.8em" }}>
                <Button htmlType="submit" style={{ width: "100%" }} title="Buy SAFE Token" type="primary">
                    {t("buy_product.token_buy")}
                </Button>
            </Form.Item>
        </Form>
    </Spin>;
}
