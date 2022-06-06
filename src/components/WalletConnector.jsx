import { Row, Card, Typography, Button, Col } from "antd";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { clearProvider } from "../web3/wallet/providers";


export function WalletConnector(props) {
    const [isHidden, setIsHidden] = useState(false);
    const { t } = useTranslation();

    const connectWallet = useCallback(() => {

        setIsHidden(true);
        props.handleWalletConnection().catch((error) => {
            setIsHidden(false);
        });

    }, [props]);

    return <Row gutter={[25, 55]} style={{
        display: isHidden ? "none" : "flex",
        paddingLeft: "0",
        rowGap: "10px",
        columnGap: "10px",
        width: "100%",
        height: "60vh",
        placeContent: "center",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
    }}>
        <Card style={{ background: "#0a0a0a", boxShadow: "5px 5px 25px 0px rgba(255, 255, 255, 0.2)" }}>
            <Col>
                <Typography.Text style={{ fontSize: "1.2em" }}>
                    {t("wallet_connector.must_connect")}
                </Typography.Text>
            </Col>

            <Col>
                <Button type="primary" style={{ width: "20em", marginTop: "1em" }} onClick={() => { connectWallet(); }}>
                    {t("wallet_connector.connect_wallet")}
                </Button>
            </Col>

            <Col>
                <Button type="text" size="middle" style={{ marginTop: "0.5em" }} onClick={() => {
                    clearProvider();
                    connectWallet();
                }}>{t("wallet_connector.choose_another_provider")}</Button>
            </Col>
        </Card>
    </Row>;
}