import { formatBigNumber, formatNumber } from "../web3/utils";
import { useState } from 'react';
import { InputNumber, Form, Typography } from "antd";
import { useTranslation } from 'react-i18next';


function getTokenAdjustedAmount(amount, productPrice) {
    const totalPrice = productPrice * amount;
    const roundedPrice = formatNumber(Math.floor((totalPrice + Number.EPSILON) * 100) / 100);
    return roundedPrice;
}


export function TokenInput(props) {
    const {
        productPrice,
        prefixSymbol,
        postfixSymbol,
        maxValue,
        inputValue,
        setInputValue,
        useAddon,
        minValue,
    } = props;
    const [tokenUsdPrice, setTokenUsdPrice] = useState(0);
    const [status, setStatus] = useState("");
    const { t } = useTranslation();

    const handleChange = (value) => {
        const newAmount = parseFloat(value);

        if (isNaN(newAmount)) {
            setTokenUsdPrice("0");
            setStatus("error");
        } else {
            setTokenUsdPrice(getTokenAdjustedAmount(newAmount, formatBigNumber(productPrice)));
            setStatus("");
        }

        setInputValue(value);
    };

    return <Form.Item name="amount" rules={[{ required: true, message: t('buy_product.buy_form.amount.error') }]}>
        <InputNumber
            onChange={handleChange}
            min={minValue}
            max={maxValue}
            prefix={prefixSymbol}
            size="large"
            value={inputValue}
            status={status}
            controls={false}
            style={{ width: "100%" }}
            formatter={formatNumber}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            addonAfter={
                useAddon ? <Typography.Text>{tokenUsdPrice} {postfixSymbol}</Typography.Text> : null
            } />
    </Form.Item>;
}
