import { t } from "i18next";
import { useNavigate, useParams } from "react-router";
import { Fragment, useEffect } from 'react';
import { useProvider, useProductData } from "../../hooks";
import { Loading, WalletConnector } from "../../components";
import { formatBigNumber } from "../../web3/utils";
import { checkProductExists } from "../../web3/contracts/ObserverContract";
import { addTokenToWallet } from "../../web3/wallet/functions";
import { Col, Row, Divider, Typography } from "antd";
import { AnalyticsSection } from "./sections/Analytics";
import { ProductBuySection } from "./sections/ProductBuy";
import { ProductInfo } from "./sections/ProductInfo";
import settings from "../../settings";


export default function ProductPage() {
    const { productAddress } = useParams();
    const { providerData, handleWalletConnection } = useProvider();
    const productData = useProductData(productAddress, providerData);
    const navigate = useNavigate();

    useEffect(() => {
        if(providerData === null || settings.DEBUG){
            return;
        }

        checkProductExists(providerData, settings.OBSERVER_ADDRESS, productAddress).then((doesExist) => {
            if(!doesExist){ navigate('/not_found/'); }
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
            <Divider style={{ marginTop: "0.2em" }} />

            <Row style={{
                width: "100%", display: "flex",
                alignItems: "center", flexDirection: "column",
                alignContent: "center", justifyContent: "center",
            }}>
                <Row style={{ display: "flex", alignItems: "baseline" }}>
                    <Typography.Title level={2} title={t('buy_product.product_name')} style={{
                        cursor: "pointer",
                        margin: 0,
                        fontWeight: 100,
                        marginBottom: "0.3em",
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
                            )
                        }}>{productData.name}</Typography.Title>

                    <Typography.Title level={4} style={{ margin: 0, fontWeight: 100 }}
                        title={t('buy_product.product_price')}>
                        ({formatBigNumber(productData.price)}$)
                    </Typography.Title>
                </Row>

                <ProductBuySection providerData={providerData} productData={productData} />
            </Row>

            <Col span={24}>
                <AnalyticsSection providerData={providerData} 
                    productAddress={productAddress} productData={productData} />
            </Col>

            <Col span={24}>
                <ProductInfo data={[
                    { question: "How does it work?",
                        answer: `Indices allow you to diversify your investments without any 
                        problems with management or the price of the assets.
                        You just buy the tokens here or on the exchanges, and each token has underlying assets that 
                        define it's price`},
                    { question: "How to sell?",
                        answer: `If your index is unlocked, you can sell your tokens here, but we advise doing that with
                        exchanges, as the fees will be lower and the settlement will be faster. `},
                    { question: "What is debt?",
                        answer: `We don't sell your tokens right away(Blockchain does not allow that). But,
                        instead, we add debt to the system that indicates that you need to receive some money in the future.
                        You can get it the next day with a special panel on that website`},
                    { question: "Why are fees so high?", answer: `Fees is the only way for us to make money.
                        When you buy our indices, the majority of your dollars goes to the underlying assets(BTC, ETH...).
                        But, in order to operate the system, we need to run additional settlement transactions off-chain,
                        and that is the main place for your fees. Also, we use them to support the project development`},
                    { question: "What does 'locked' means?", answer: `Locked products are not available for selling.
                        They still work as the normal instruments, but the users cannot sell the tokens on that website,
                        which will make them use exchanges and increase the popularity of the project and tokens`},
                    { question: "Unknown error", answer: `There may be some errors that we do not control. For example,
                        the exchange where we buy our underlying assets may experience some problems. 
                        You can wait for a little bit, but if the problem does not go away, contact us` },
                    { question: "Are there any guarantees?", answer: 
                        <Typography.Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                            We don't have any guarantees. 
                            All responsibility falls on you
                        </Typography.Text>
                    }
                ]} />
            </Col>
        </Fragment>}
    </Col>;

}
