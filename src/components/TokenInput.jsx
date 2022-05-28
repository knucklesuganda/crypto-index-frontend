import { useState } from 'react';
import { formatBigNumber, formatNumber } from "../web3/utils";
import { InputNumber, Typography, Form } from "antd";
import { useTranslation } from 'react-i18next';


export function TokenInput(props) {
    const { productPrice, productSymbol, inputValue, setInputValue, useAddon } = props;
    const [tokenUsdPrice, setTokenUsdPrice] = useState(0);
    const [status, setStatus] = useState("");
    const { t } = useTranslation();

    return <Form.Item name="amount" rules={[{ required: true, message: t('buy_product.buy_form.amount.error') }]}>
        <InputNumber
            onChange={(value) => {
                const newAmount = parseFloat(value);

                if (!isNaN(newAmount)) {
                    let totalPrice = formatBigNumber(productPrice) * newAmount;
                    const roundedPrice = formatNumber(Math.round((totalPrice + Number.EPSILON) * 100) / 100);
                    setTokenUsdPrice(roundedPrice);
                    setStatus("");
                } else {
                    setTokenUsdPrice("0");
                    setStatus("error");
                }

                setInputValue(newAmount);
            }}
            min={0} size="large" style={{ width: "100%" }} status={status}
            value={inputValue} controls={false} formatter={formatNumber} prefix={productSymbol}
            parser={value => value.replace(/\$\s?|(,*)/g, '')} 
            addonAfter={useAddon ? <Typography.Text>{tokenUsdPrice}$</Typography.Text> : null} />
    </Form.Item>;
}
