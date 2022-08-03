import { SafeTokenDescription } from "./sections/SafeTokenDescription";
import { SafeTokenAnalytics } from "./sections/SafeTokenAnalytics";
import { Fragment, useEffect, useRef, useState } from "react";
import { useMobileQuery } from "../../components/MediaQuery";
import { getDummyProvider } from "../../web3/wallet/providers";
import { addTokenToWallet } from "../../web3/wallet/functions";
import { NetworkOverlay } from "../../components/NetworkOverlay";
import { SafeMinter } from "../../web3/contracts/safe_token";
import { SafeTokenBuy } from "./sections/SafeTokenBuy";
import { bigNumberToNumber } from "../../web3/utils";
import { Row, Col, Typography, message } from "antd";
import { useNetwork } from "../../hooks/useNetwork";
import { WalletConnector } from "../../components";
import { useTranslation } from "react-i18next";
import { useProvider } from "../../hooks";
import settings from "../../settings";
import { BigNumber } from "ethers";
import "./style.css";


export default function SafeTokenPage() {
    const { t } = useTranslation();
    const productAddress = settings.NETWORKS.POLYGON.PRODUCTS[0].address;
    const { network, changeNetworkParam, currentNetworkId } = useNetwork();
    const [tokenPrice, setTokenPrice] = useState(0);
    const [safeTokenData, setSafeTokenData] = useState(null);
    const { providerData, handleWalletConnection } = useProvider();
    const [isPriceMatic, setIsPriceMatic] = useState(true);
    const tokenDataInterval = useRef(null);
    const isMobile = useMobileQuery();

    useEffect(() => {
        document.body.className = "";
        document.title = `Void | ${t("index.safe_token")}`;

        const getTokenData = () => {
            let minter;

            if (providerData !== null) {
                minter = new SafeMinter(productAddress, providerData);
            } else {
                minter = new SafeMinter(productAddress, getDummyProvider(productAddress, network));
            }

            if (isPriceMatic) {
                setTokenPrice(BigNumber.from("100000000000000000"));
            } else {
                minter.getPrice().then(price => setTokenPrice(price)).catch(() => {});
            }

            minter.getToken().then(token => {
                token.getInfo().then(data => { setSafeTokenData(data) })
            }).catch(() => {});
        };

        getTokenData();
        tokenDataInterval.current = setInterval(getTokenData, settings.STATE_UPDATE_INTERVAL);

        return () => { clearInterval(tokenDataInterval.current) };
    }, [changeNetworkParam, t, providerData, productAddress, isPriceMatic, network]);

    return <NetworkOverlay currentNetworkId={currentNetworkId}
        wantedNetwork={settings.NETWORKS.POLYGON}
        changeNetwork={changeNetworkParam}>

        <Row style={{ width: "100%", marginTop: "3em", paddingLeft: isMobile ? "0" : "3em" }}>
            <Col style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
                flexDirection: "column",
            }}>
                <Row style={{ display: "flex", alignItems: "baseline" }}>
                    <Typography.Title level={2} style={{
                        cursor: "pointer",
                        fontWeight: 100,
                        marginBottom: "0.3em",
                        textDecoration: "underline",
                        textDecorationThickness: "from-font",
                    }} onMouseEnter={(event) => { event.target.style.color = '#1890ff'; }}
                        onMouseLeave={(event) => { event.target.style.color = '#bfbfbf'; }}
                        onClick={() => {
                            const token = safeTokenData.token;

                            addTokenToWallet(providerData.provider, {
                                symbol: token.symbol,
                                address: token.address,
                                decimals: token.decimals,
                                image: token.image,
                            }).then((wasAdded) => {
                                message.info(wasAdded ? t('wallet.token_added') : t("wallet.token_not_added"));
                            }).catch((error) => {
                                message.error(error.message.toString());
                            });

                        }}>{t("index.safe_token")}</Typography.Title>

                    <Typography.Title level={4} style={{ margin: 0, fontWeight: 100 }}>
                        ({bigNumberToNumber(tokenPrice)} {isPriceMatic ? "MATIC" : "$"})
                    </Typography.Title>
                </Row>

                {providerData === null ?
                    <WalletConnector style={{ alignContent: "flex-start", height: "auto" }}
                        handleWalletConnection={handleWalletConnection} /> :
                    <SafeTokenBuy productAddress={productAddress}
                        providerData={providerData}
                        tokenPrice={tokenPrice}
                        tokenBalance={safeTokenData ? safeTokenData.token.balance : null}
                        mintSupply={safeTokenData ? safeTokenData.mintSupply : null}
                        isPriceMatic={isPriceMatic} setIsPriceMatic={setIsPriceMatic} />}
            </Col>

            <Row style={{
                width: "100%",
                marginTop: "3em",
                marginBottom: "5em",
                display: "flex",
                justifyContent: "center",
            }}>
                {isMobile ? <Fragment>
                    <SafeTokenAnalytics safeTokenData={safeTokenData} isPriceMatic={isPriceMatic}
                        tokenPrice={tokenPrice} isWalletOffline={providerData === null} />
                    <SafeTokenDescription />
                </Fragment> :
                    <Fragment>
                        <SafeTokenDescription />
                        <SafeTokenAnalytics safeTokenData={safeTokenData} isPriceMatic={isPriceMatic}
                            tokenPrice={tokenPrice} isWalletOffline={providerData === null} />
                    </Fragment>}
            </Row>
        </Row>
    </NetworkOverlay>;
}
