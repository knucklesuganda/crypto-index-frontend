import { SafeTokenAnalytics } from "./sections/SafeTokenAnalytics";
import { getDummyProvider } from "../../web3/wallet/providers";
import { addTokenToWallet } from "../../web3/wallet/functions";
import { SafeMinter } from "../../web3/contracts/safe_token";
import { SafeTokenBuy } from "./sections/SafeTokenBuy";
import { bigNumberToNumber } from "../../web3/utils";
import { useNetwork } from "../../hooks/useNetwork";
import { WalletConnector } from "../../components";
import { useTranslation } from "react-i18next";
import { Row, Col, Typography, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useProvider } from "../../hooks";
import { useParams } from "react-router";
import settings from "../../settings";
import { BigNumber } from "ethers";
import "./style.css";


export default function SafeTokenPage() {
    const { t } = useTranslation();
    const { productAddress } = useParams();
    const { network, changeNetworkParam } = useNetwork();
    const [tokenPrice, setTokenPrice] = useState(0);
    const [safeTokenData, setSafeTokenData] = useState(null);
    const { providerData, handleWalletConnection } = useProvider();
    const [isPriceMatic, setIsPriceMatic] = useState(true);
    const tokenDataInterval = useRef(null);

    useEffect(() => {
        // if (getChainParameter() !== settings.NETWORKS.POLYGON.ID) {
        //     changeNetworkParam(settings.NETWORKS.POLYGON.ID);
        //     message.info(t("wallet.change_network"));
        // }

        document.body.className = "";
        document.title = `Void | ${t("index.safe_token")}`;

        const getTokenData = () => {
            let minter;

            if (providerData !== null) {
                minter = new SafeMinter(productAddress, providerData);
            } else {
                minter = new SafeMinter(productAddress, getDummyProvider(productAddress, network));
            }

            if(isPriceMatic) {
                setTokenPrice(BigNumber.from("100000000000000000"));
            }else{
                minter.getPrice().then(price => setTokenPrice(price));
            }

            minter.getToken().then(token => {
                token.getInfo().then(data => { setSafeTokenData(data) });
            });

        };

        getTokenData();
        tokenDataInterval.current = setInterval(getTokenData, settings.STATE_UPDATE_INTERVAL);

        return () => { clearInterval(tokenDataInterval.current) };
    }, [changeNetworkParam, t, providerData, productAddress, isPriceMatic, network]);

    return <Row style={{ width: "100%", marginTop: "3em", paddingLeft: "3em" }}>
        <Col style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column",
        }}>
            <Row style={{ display: "flex", alignItems: "baseline" }}>
                <Typography.Title level={2} style={{ cursor: "pointer", fontWeight: 100, marginBottom: "0.3em" }}
                    onMouseEnter={(event) => { event.target.style.color = '#1890ff'; }}
                    onMouseLeave={(event) => { event.target.style.color = '#bfbfbf'; }}
                    onClick={() => {
                        const token = safeTokenData.token;

                        addTokenToWallet(providerData.provider, {
                            symbol: token.symbol,
                            address: token.address,
                            decimals: token.decimals,
                            image: token.image,
                        }).catch(() => { });

                    }}>{t("index.safe_token")}</Typography.Title>

                <Typography.Title level={4} style={{ margin: 0, fontWeight: 100 }}>
                    ({bigNumberToNumber(tokenPrice)} {isPriceMatic ? "MATIC" : "$"})
                </Typography.Title>
            </Row>

            {providerData === null ?
                <WalletConnector style={{ alignContent: "flex-start", height: "auto" }}
                    handleWalletConnection={handleWalletConnection} />

                :

                <SafeTokenBuy productAddress={productAddress}
                    providerData={providerData} tokenPrice={tokenPrice}
                    mintSupply={safeTokenData ? safeTokenData.mintSupply : null}
                    isPriceMatic={isPriceMatic} setIsPriceMatic={setIsPriceMatic} />
            }
        </Col>

        <Row style={{ marginTop: "3em", width: "100%", marginBottom: "10em" }}>
            <Col span={8}>
                <Col>
                    <Typography.Title italic style={{ fontWeight: 100 }}>What is SAFE Token?</Typography.Title>

                    <Typography.Text style={{ fontSize: "1.4em" }}>
                        SAFE Token is a currency that will allow you to protect your investments from big price changes.
                    </Typography.Text>
                </Col>

                <Col style={{ marginTop: "4em" }}>
                    <Typography.Title italic style={{ fontWeight: 100 }}>How does SAFE work?</Typography.Title>

                    <Typography.Text style={{ fontSize: "1.4em" }}>
                        You can only use a small fraction of tokens each day.
                        That makes everyone <span style={{ fontStyle: "italic" }}>HODL</span> and protects the price
                    </Typography.Text>
                </Col>

                <Col style={{ marginTop: "4em" }}>
                    <Typography.Title italic style={{ fontWeight: 100 }}>But how does it protect the price?</Typography.Title>

                    <Typography.Text style={{ fontSize: "1.4em" }}>
                        People cannot sell or buy millions of tokens, and big players have the same daily usage limits as
                        average people. Without big sells or buys, we cannot move the price heavily!
                    </Typography.Text>
                </Col>
            </Col>

            <SafeTokenAnalytics safeTokenData={safeTokenData} isPriceMatic={isPriceMatic}
                tokenPrice={tokenPrice} isWalletOffline={providerData === null} />
        </Row>
    </Row>;
}
