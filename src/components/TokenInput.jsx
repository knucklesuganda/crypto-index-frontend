import { useState } from 'react';
import { formatNumber, roundNumber } from "../web3/utils";
import { InputNumber, Form, Typography } from "antd";
import { useTranslation } from 'react-i18next';


function getTokenRoundedPrice(amount, productPrice) {
    const totalPrice = productPrice * amount;
    const roundedPrice = formatNumber(Math.floor((totalPrice + Number.EPSILON) * 100000) / 100000);
    return roundedPrice;
}


export function TokenInput(props) {
    const { productPrice, prefixSymbol, postfixSymbol, maxValue, useAddon, inputRef, minValue } = props;
    const [tokenUsdPrice, setTokenUsdPrice] = useState(0);
    const [status, setStatus] = useState("");
    const { t } = useTranslation();

    const handleChange = (value) => {
        const newAmount = parseFloat(value.replace(",", ""));

        if (isNaN(newAmount)) {
            setTokenUsdPrice("0");
            setStatus("error");
        } else {
            setTokenUsdPrice(getTokenRoundedPrice(newAmount, roundNumber(productPrice)));
            setStatus("");
        }
    };

    return <Form.Item name="amount" rules={[{ required: true, message: t('buy_product.buy_form.amount.error') }]}
        style={{ marginBottom: "0.5em" }}>
        <InputNumber
            ref={inputRef}
            onInput={handleChange}
            min={minValue}
            max={maxValue}
            prefix={prefixSymbol}
            size="large"
            status={status}
            controls={false}
            style={{ width: "100%" }}
            formatter={formatNumber}
            parser={value => value.replace(',', '')}
            addonAfter={
                useAddon ? <Typography.Text>{tokenUsdPrice} {postfixSymbol}</Typography.Text> : null
            } />
    </Form.Item>;
}
