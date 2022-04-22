import { Col, Button, notification, message } from "antd";
import { store } from "../store/store";
import { addSavedTokenAction } from "../store/savedTokens";
import { addTokenToWallet } from "../web3/wallet/functions";
import { useSelector } from "react-redux";


const notificationId = "addTokenNotification";


export function AddToken(props) {
    const savedTokens = useSelector(state => state.savedTokens);

    if(savedTokens.includes(props.token.address)){
        return <Col></Col>;
    }

    return <Col>
        <Button type="primary" onClick={() => {
            addTokenToWallet(
                props.providerData.provider,
                {
                    address: props.token.address,
                    symbol: props.token.symbol,
                    decimals: props.token.decimals,
                    image: props.token.image,
                }
            ).then((result) => {
                store.dispatch(addSavedTokenAction(result.suggestedAssetMeta.asset.address));
            }).catch((error) => {
                message.error({ content: `Error: ${error}` });
            });

            notification.close(notificationId);
        }}>Click here to add {props.productData.name} to your wallet</Button>
    </Col>;
}


export function addTokenNotification(providerData, token) {
    setTimeout(() => {
        notification.info(({
            key: notificationId,
            message: 'Add tokens to your wallet!',
            description: <AddToken token={token} providerData={providerData} />,
        }));
    }, 3000);
}
