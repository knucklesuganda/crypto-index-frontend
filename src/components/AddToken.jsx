import { Col, Button, notification, message } from "antd";
import { store } from "../store/store";
import { addSavedTokenAction } from "../store/savedTokens";
import { addTokenToWallet } from "../web3/wallet/functions";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const notificationId = "addTokenNotification";


export function AddToken(props) {
    const savedTokens = useSelector(state => state.savedTokens);
    const { t } = useTranslation();

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
                message.error({ content: `${t('error')}: ${error}` });
            });

            notification.close(notificationId);
        }}>{t('components.add_token.start')} {props.productData.name} {t('components.add_token.end')}</Button>
    </Col>;
}


export function addTokenNotification(providerData, token, message) {
    setTimeout(() => {
        notification.info(({
            key: notificationId,
            message,
            description: <AddToken token={token} providerData={providerData} />,
        }));
    }, 3000);
}
