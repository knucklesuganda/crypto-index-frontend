import { Row, Col, Typography, Form, Button, message, Statistic, Progress } from "antd";
import { SafeMinter } from "../../web3/contracts/safe_token/SafeMinter";
import { getSafeTokenMintPrice } from "../../web3/contracts/safe_token/functions";
import { getChainParameter, useNetwork } from "../../hooks/useNetwork";
import { Loading, TokenInput, WalletConnector } from "../../components";
import { bigNumberToNumber, convertToEther } from "../../web3/utils";
import Countdown from "antd/lib/statistic/Countdown";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useProvider } from "../../hooks";
import { useParams } from "react-router";
import "./style.css";


export default function SafeTokenPage() {
    const { productAddress } = useParams();
    const inputRef = useRef(null);
    const { t } = useTranslation();
    const { changeNetworkParam } = useNetwork();
    const { providerData, handleWalletConnection } = useProvider();
    const [tokenPrice, setTokenPrice] = useState(0);
    const [safeTokenData, setSafeTokenData] = useState(null);

    useEffect(() => {
        // if (getChainParameter() !== settings.NETWORKS.POLYGON.ID) {
        //     changeNetworkParam(settings.NETWORKS.POLYGON.ID);
        //     message.info(t("wallet.change_network"));
        // }

        getSafeTokenMintPrice().then((price) => { setTokenPrice(price) });
        document.body.className = "";
        document.title = `Void | ${t("index.safe_token")}`;

        if (providerData !== null) {

            const minter = new SafeMinter(productAddress, providerData);

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
            <Typography.Title level={2} style={{ fontWeight: "100" }}>{t("index.safe_token")}</Typography.Title>

            <Form>
                {tokenPrice === 0 ? <Loading /> :
                    <TokenInput useAddon
                        inputRef={inputRef}
                        productPrice={tokenPrice}
                        pricePrecision={1}
                        prefixSymbol="SAFE"
                        postfixSymbol="USD"
                        minValue={1}
                        maxValue={safeTokenData === null ? '0' : safeTokenData.mintSupply} />
                }

                <Form.Item style={{ marginTop: 0 }}>
                    <Button htmlType="submit" style={{ width: "100%" }} title="Buy SAFE Token" type="primary">
                        {t("buy_product.token_buy")}
                    </Button>
                </Form.Item>
            </Form>
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
                            <Statistic title="Total supply / Max supply"
                                value={bigNumberToNumber(safeTokenData.totalSupply)}
                                suffix={`/ ${bigNumberToNumber(safeTokenData.mintSupply)} SAFE`} />

                            <Statistic title="Mint price(10 MATIC = 1 SAFE)"
                                value={bigNumberToNumber(tokenPrice, 8)} suffix="$" style={{ textAlign: "end" }} />
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
                                        `${bigNumberToNumber(safeTokenData.userLeftLimit)} 
                                        / ${bigNumberToNumber(safeTokenData.userTransferLimit)}`
                                    }
                                />
                                } />

                            <Progress type="circle" width={250}
                                percent={safeTokenData.totalLeftPercentage}
                                strokeColor={safeTokenData.totalLeftPercentage >= 20 ? "green" : "red"}
                                format={() => <Statistic title="Total token usage" style={{ fontSize: "0.7em" }}
                                    value={
                                        `${bigNumberToNumber(safeTokenData.totalLeftLimit)} 
                                        / ${bigNumberToNumber(safeTokenData.totalTransferLimit)}`
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
