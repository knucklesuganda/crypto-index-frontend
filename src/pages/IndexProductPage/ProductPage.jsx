import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { formatBigNumber } from "../../web3/utils";
import { Observer } from "../../web3/contracts";
import { OnlyDesktop } from "../../components/MediaQuery";
import { useProvider, useProductData } from "../../hooks";
import { Loading, WalletConnector } from "../../components";
import { addTokenToWallet } from "../../web3/wallet/functions";
import { Col, Row, Divider, Typography, message } from "antd";
import { AnalyticsSection, ProductBuySection, ProductInfo } from "./sections";
import settings from "../../settings";


export default function ProductPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { productAddress } = useParams();
    const { providerData, handleWalletConnection } = useProvider();
    const { productData, index } = useProductData(productAddress, providerData);

    useEffect(() => {
        if (providerData === null || settings.DEBUG) {
            return;
        }

        const observer = new Observer(settings.OBSERVER_ADDRESS, providerData);
        observer.checkProductExists(productAddress).then(doesExist => {
            if (!doesExist) {
                navigate('/not_found/');
            }
        });

        return () => {};
    }, [productAddress, navigate, providerData]);

    if (providerData === null) {
        return <WalletConnector handleWalletConnection={handleWalletConnection} />;
    } else if (productData === null) {
        return <Loading />;
    }

    return <Col style={{ paddingRight: "1em", paddingBottom: "4em", paddingLeft: "1em", width: "100wv" }}>
        <OnlyDesktop>
            <Divider style={{ marginTop: "0.2em" }} />
        </OnlyDesktop>

        <Row style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
        }}>
            <Row style={{ display: "flex", alignItems: "baseline" }}>
                <Typography.Title level={2} title={t('buy_product.product_name')}
                    style={{ cursor: "pointer", margin: 0, fontWeight: 100, marginBottom: "0.3em" }}
                    onMouseEnter={(event) => { event.target.style.color = '#1890ff'; }}
                    onMouseLeave={(event) => { event.target.style.color = '#bfbfbf'; }}

                    onClick={() => {
                        addTokenToWallet(providerData.provider, {
                            address: productData.productToken.address,
                            symbol: productData.productToken.symbol,
                            decimals: productData.productToken.decimals,
                            image: productData.productToken.image,
                        }).catch((error) => {
                            message.error({ content: `${t('error')}: ${error.message}` });
                        });

                    }}>{productData.name}</Typography.Title>

                <Typography.Title level={4} style={{ margin: 0, fontWeight: 100 }}
                    title={t('buy_product.product_price')}>
                    ({formatBigNumber(productData.price)} {productData.buyToken.symbol})
                </Typography.Title>
            </Row>

            <ProductBuySection product={index} providerData={providerData} productData={productData} />
        </Row>

        <Col span={24}>
            <AnalyticsSection product={index}
                providerData={providerData}
                productAddress={productAddress}
                productData={productData} />
        </Col>

        <Col span={24}>
            <ProductInfo data={t('buy_product.questions')} />
        </Col>
    </Col>;

}
