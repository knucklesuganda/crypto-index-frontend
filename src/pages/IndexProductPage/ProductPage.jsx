import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { roundNumber } from "../../web3/utils";
import { OnlyDesktop } from "../../components/MediaQuery";
import { useProvider, useProductData } from "../../hooks";
import { Loading, WalletConnector } from "../../components";
import { addTokenToWallet, getProductByAddress } from "../../web3/wallet/functions";
import { Col, Row, Divider, Typography, message } from "antd";
import { AnalyticsSection, ProductBuySection, ProductInfo } from "./sections";
import { useNetwork } from "../../hooks/useNetwork";
import { INDEX_PAGE } from "../../routes";


export default function ProductPage() {
    const { t } = useTranslation();
    const { network } = useNetwork();
    const { productAddress } = useParams();
    const { providerData, handleWalletConnection } = useProvider();
    const { productData, product } = useProductData(providerData, productAddress);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = "";
        return () => {};
    });

    if (providerData === null) {
        return <WalletConnector handleWalletConnection={handleWalletConnection} />;
    } else if (getProductByAddress(network.PRODUCTS, productAddress) === null) {
        navigate(INDEX_PAGE);
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
                    ({roundNumber(productData.price)} {productData.buyToken.symbol})
                </Typography.Title>
            </Row>

            <ProductBuySection product={product} providerData={providerData} productData={productData} />
        </Row>

        <Col span={24}>
            <AnalyticsSection product={product} providerData={providerData} 
                productAddress={productAddress} productData={productData} />
        </Col>

        <Col span={24}>
            <ProductInfo data={t('buy_product.questions')} />
        </Col>
    </Col>;
}
