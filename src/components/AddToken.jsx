import { Col, Button, notification } from "antd";
import { addTokenToWallet } from "../web3/wallet/functions";

export function AddToken(props) {
    return <Col>
        <Button type="primary" onClick={() => {
            addTokenToWallet(
                props.providerData.provider,
                props.productData.productToken.address,
                props.productData.productToken.symbol,
                props.productData.productToken.decimals,
                props.productData.productToken.image,
            );
        }}>Click here to add {props.productData.title} to your wallet</Button>
    </Col>;
}


export function addTokenNotification(providerData, productData) {
    setTimeout(() => {
        notification.info(({
            message: 'Add tokens to your wallet',
            description: <AddToken productData={productData} providerData={providerData} />,
        }));
    }, 3000);
}
