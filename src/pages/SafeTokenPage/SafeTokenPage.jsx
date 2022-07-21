import { getChainParameter, useNetwork } from "../../hooks/useNetwork";
import { Row, Col, Typography, Form, Button, message } from "antd";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TokenInput } from "../../components";
import settings from "../../settings";


export default function SafeTokenPage() {
    const inputRef = useRef(null);
    const { changeNetworkParam } = useNetwork();
    const { t } = useTranslation();

    useEffect(() => {
        if (getChainParameter() !== settings.NETWORKS.POLYGON.ID) {
            changeNetworkParam(settings.NETWORKS.POLYGON.ID);
            message.info(t("wallet.change_network"));
        }

        document.body.className = "indexBackground";

        return () => {};
    }, [changeNetworkParam]);

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
                <TokenInput useAddon inputRef={inputRef} productPrice={1} prefixSymbol="SAFE"
                    postfixSymbol="ETH" maxValue="" minValue="1" />

                <Form.Item style={{ marginTop: 0 }}>
                    <Button htmlType="submit" style={{ width: "100%" }} title="Buy SAFE Token" type="primary">
                        {t("buy_product.token_buy")}
                    </Button>
                </Form.Item>
            </Form>
        </Col>

        <Col span={24} style={{
            marginTop: "3em",
            maxWidth: "35vw",
        }}>
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
    </Row>;
}
