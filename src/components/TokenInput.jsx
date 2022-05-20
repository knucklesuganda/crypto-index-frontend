import { useState } from 'react';
import { formatBigNumber, formatNumber } from "../web3/utils";
import { addIndexFee } from "../web3/contracts/IndexContract";
import { InputNumber, Typography } from "antd";


export function TokenInput(props) {
    const { productPrice, productFee, productSymbol, inputValue, setInputValue } = props;
    const [tokenUsdPrice, setTokenUsdPrice] = useState(0);

    return <InputNumber min={0} size="large" style={{ width: "100%" }}
        onChange={(value) => {
            const newAmount = parseFloat(value);

            if (!isNaN(newAmount)) {
                let totalPrice = addIndexFee(formatBigNumber(productPrice), productFee, newAmount);
                const roundedPrice = formatNumber(Math.round((totalPrice + Number.EPSILON) * 100) / 100);
                setTokenUsdPrice(roundedPrice);
            } else {
                setTokenUsdPrice("0");
            }

            setInputValue(newAmount);
        }}
        value={inputValue} controls={false} formatter={formatNumber} prefix={productSymbol}
        addonAfter={<Typography.Text>{tokenUsdPrice}$</Typography.Text>}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
    />;
}
