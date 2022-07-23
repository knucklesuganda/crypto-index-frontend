import { bigNumberToNumber, formatNumber } from "../../web3/utils";
import { Row, Col, Typography, Statistic, Progress } from "antd";
import { SafeMinter } from "../../web3/contracts/safe_token";
import { Loading, WalletConnector } from "../../components";
import { SafeTokenBuy } from "./sections/SafeTokenBuy";
import { Fragment, useEffect, useState } from "react";
import Countdown from "antd/lib/statistic/Countdown";
import { useNetwork } from "../../hooks/useNetwork";
import { useTranslation } from "react-i18next";
import { useProvider } from "../../hooks";
import { useParams } from "react-router";
import "./style.css";
import { addTokenToWallet } from "../../web3/wallet/functions";


export default function SafeTokenPage() {
    const { t } = useTranslation();
    const { productAddress } = useParams();
    const { changeNetworkParam } = useNetwork();
    const [tokenPrice, setTokenPrice] = useState(0);
    const [safeTokenData, setSafeTokenData] = useState(null);
    const { providerData, handleWalletConnection } = useProvider();

    useEffect(() => {
        // if (getChainParameter() !== settings.NETWORKS.POLYGON.ID) {
        //     changeNetworkParam(settings.NETWORKS.POLYGON.ID);
        //     message.info(t("wallet.change_network"));
        // }

        document.body.className = "";
        document.title = `Void | ${t("index.safe_token")}`;

        if (providerData !== null) {
            const minter = new SafeMinter(productAddress, providerData);
            minter.getPrice().then(price => setTokenPrice(price));

            minter.getToken().then(token => {
                token.getInfo().then(data => { setSafeTokenData(data) });
            });
        }

        return () => { };
    }, [changeNetworkParam, t, providerData, productAddress]);

    if (providerData === null) {
        return <WalletConnector handleWalletConnection={handleWalletConnection} />;
    }

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
                        });

                    }}>{t("index.safe_token")}</Typography.Title>

                <Typography.Title level={4} style={{ margin: 0, fontWeight: 100 }}>
                    ({bigNumberToNumber(tokenPrice)}$)
                </Typography.Title>
            </Row>

            <SafeTokenBuy productAddress={productAddress}
                providerData={providerData} tokenPrice={tokenPrice}
                mintSupply={safeTokenData ? safeTokenData.mintSupply : null} />
        </Col>

        <Row style={{ marginTop: "3em", width: "100%" }}>
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

            <Col style={{
                border: "1px solid #303030",
                boxShadow: "0 0 5px 2px rgba(255, 255, 255, 0.2)",
                padding: "1em",
                fontSize: "1.2em",
                width: "30vw",
                marginLeft: "10em",
            }}>
                <Typography.Title level={3} style={{ fontWeight: 100, textAlign: "center" }}>
                    Analytics
                </Typography.Title>

                <Col style={{ width: "100%" }}>
                    {safeTokenData === null ? <Loading /> : <Fragment>

                        <Row style={{ display: "flex", justifyContent: "space-between" }}>
                            <Statistic title="Mint supply / Total supply"
                                value={bigNumberToNumber(safeTokenData.mintSupply)}
                                suffix={`/ ${formatNumber(bigNumberToNumber(safeTokenData.totalSupply))
                                    } SAFE`} />

                            <Statistic title="Mint price(10 MATIC = 1 SAFE)" suffix="$"
                                value={bigNumberToNumber(tokenPrice)} style={{ textAlign: "end" }} />
                        </Row>

                        <Row style={{ marginTop: "1em", display: "flex", justifyContent: "space-between" }}>
                            <Statistic title="Max transfer percentage" value={safeTokenData.maxTransferPercentage}
                                suffix="%" />
                            <Countdown title="Next reset" value={safeTokenData.nextResetTime} format="HH:mm:ss"
                                style={{ textAlign: "end" }} />
                        </Row>

                        <Row style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                            <Progress type="circle" width={250}
                                percent={safeTokenData.userLeftPercentage}
                                strokeColor={safeTokenData.userLeftPercentage >= 20 ? "green" : "red"}
                                format={() => <Statistic title="Your daily usage" style={{ fontSize: "0.7em" }}
                                    value={
                                        `${formatNumber(bigNumberToNumber(safeTokenData.userLeftLimit))}
                                        / ${formatNumber(bigNumberToNumber(safeTokenData.userTransferLimit))}`
                                    }
                                />
                                } />

                            <Progress type="circle" width={250}
                                percent={safeTokenData.totalLeftPercentage}
                                strokeColor={safeTokenData.totalLeftPercentage >= 20 ? "green" : "red"}
                                format={() => <Statistic title="Total token usage" style={{ fontSize: "0.7em" }}
                                    value={
                                        `${formatNumber(bigNumberToNumber(safeTokenData.totalLeftLimit))} 
                                        / ${formatNumber(bigNumberToNumber(safeTokenData.totalTransferLimit))}`
                                    }
                                />}
                            />
                        </Row>

                    </Fragment>}
                </Col>

            </Col>

        </Row>
    </Row>;
}
