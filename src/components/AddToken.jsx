import { Col, Button, notification } from "antd";
import { addTokenToWallet } from "../web3/wallet/functions";

const notificationId = "addTokenNotification";


export function AddToken(props) {
    return <Col>
        <Button type="primary" onClick={() => {
            addTokenToWallet(
                props.providerData.provider,
                {
                    address: props.productData.productToken.address,
                    symbol: props.productData.productToken.symbol,
                    decimals: props.productData.productToken.decimals,
                    image: props.productData.productToken.image,
                },
            );
            notification.close(notificationId);

        }}>Click here to add {props.productData.title} to your wallet</Button>
    </Col>;
}


export function addTokenNotification(providerData, productData) {
    setTimeout(() => {
        notification.info(({
            key: notificationId,
            message: 'Add tokens to your wallet',
            description: <AddToken productData={productData} providerData={providerData} />,
        }));
    }, 3000);
}
