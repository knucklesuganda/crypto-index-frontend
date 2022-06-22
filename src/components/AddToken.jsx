import { Col, Button, notification, message } from "antd";
import { addTokenToWallet } from "../web3/wallet/functions";
import { useTranslation } from "react-i18next";


const notificationId = "addTokenNotification";


export function AddToken(props) {
    const { t } = useTranslation();

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
            ).catch((error) => {
                message.error({ content: `${t('error')}: ${error.message}` });
            });

            notification.close(notificationId);
        }}>{t('components.add_token.start')} {props.productName} {t('components.add_token.end')}</Button>
    </Col>;
}


export function addTokenNotification(notificationData) {
    const { providerData, token, message, productName } = notificationData;

    setTimeout(() => {
        notification.info(({
            key: notificationId, message,
            description: <AddToken token={token} providerData={providerData} productName={productName} />,
        }));
    }, 3);
}
