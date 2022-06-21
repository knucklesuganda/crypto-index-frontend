import { useNavigate, useParams } from "react-router";
import { Fragment, useEffect, useState } from 'react';
import { useProvider, useProductData } from "../../hooks";
import { Loading, WalletConnector } from "../../components";
import { formatBigNumber } from "../../web3/utils";
import { checkProductExists, getProductType } from "../../web3/contracts/ObserverContract";
import { addTokenToWallet } from "../../web3/wallet/functions";
import { Col, Row, Divider, Typography, message } from "antd";
import { AnalyticsSection } from "./sections/Analytics";
import { ProductBuySection } from "./sections/ProductBuy";
import { ProductInfo } from "./sections/ProductInfo";
import { useTranslation } from "react-i18next";
import { OnlyDesktop } from "../../components/MediaQuery";
import settings from "../../settings";


export default function ProductPage() {
    const { productAddress } = useParams();
    const { providerData, handleWalletConnection } = useProvider();
    const [productType, setProductType] = useState(null);
    const productData = useProductData(productAddress, providerData, productType);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if(providerData === null || settings.DEBUG){
            return;
        }

        checkProductExists(providerData, settings.OBSERVER_ADDRESS, productAddress).then((doesExist) => {
            if(doesExist){
                getProductType(providerData, settings.OBSERVER_ADDRESS, productAddress).then((foundProductType) => {
                    setProductType(foundProductType);
                });
            }else{
                navigate('/not_found/');
            }
        });

        return () => {};
    }, [productAddress, navigate, providerData]);

    if (providerData === null) {
        return <WalletConnector handleWalletConnection={handleWalletConnection} />;
    }

    return <Col style={{
        paddingRight: "1em", paddingBottom: "4em", paddingLeft: "1em", width: "100wv"
    }}>{productData === null ? <Loading /> :
        <Fragment>
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

                    style={{
                        cursor: "pointer",
                        margin: 0,
                        fontWeight: 100,
                        marginBottom: "0.3em"
                    }}
                    onMouseEnter={(event) => { event.target.style.color = '#1890ff'; }}
                    onMouseLeave={(event) => { event.target.style.color = '#bfbfbf'; }}

                    onClick={() => {
                        addTokenToWallet(
                            providerData.provider,
                            {
                                address: productData.productToken.address,
                                symbol: productData.productToken.symbol,
                                decimals: productData.productToken.decimals,
                                image: productData.productToken.image,
                            }
                        ).catch((error) => {
                            message.error({ content: `${t('error')}: ${error}` });
                        });            
                    }}>{productData.name}</Typography.Title>

                    <Typography.Title level={4} style={{ margin: 0, fontWeight: 100 }} 
                        title={t('buy_product.product_price')}>
                            ({formatBigNumber(productData.price)} {productData.buyToken.symbol})</Typography.Title>
                </Row>

                <ProductBuySection
                    providerData={providerData}
                    productData={productData}
                    productType={productType} />
            </Row>

            <Col span={24}>
                <AnalyticsSection providerData={providerData}
                    productAddress={productAddress}
                    productData={productData}
                    productType={productType} />
            </Col>

            <Col span={24}>
                <ProductInfo data={t('buy_product.questions')} />
            </Col>
        </Fragment>}
    </Col>;

}
