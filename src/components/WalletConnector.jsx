import settings from "../settings";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { clearProvider } from "../web3/wallet/providers";
import { Row, Card, Typography, Button, Col, message, Steps, Collapse } from "antd";

const { Step } = Steps;


export function WalletConnector(props) {
    const [isHidden, setIsHidden] = useState(false);
    const { handleWalletConnection } = props;
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);

    const connectWallet = useCallback(() => {

        setIsHidden(true);
        handleWalletConnection().catch((_) => {
            setIsHidden(false);
            message.info(t("accept_wallet"));
        });

    }, [handleWalletConnection, t]);

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
                <Typography.Text style={{ fontSize: "1.2em" }}>{t("wallet_connector.must_connect")}</Typography.Text>
            </Col>

            <Col>
                <Button type="primary" style={{ width: "20em", marginTop: "1em" }}
                    onClick={() => { connectWallet() }}>{t("wallet_connector.connect_wallet")}</Button>
            </Col>

            <Col>
                <Button type="text" size="middle" style={{ marginTop: "0.5em" }} onClick={() => {
                    clearProvider().then(() => { connectWallet(); });
                }}>{t("wallet_connector.choose_another_provider")}</Button>
            </Col>

            <Col style={{ marginTop: "1em", display: "flex", justifyContent: "center" }}>
                <Collapse defaultActiveKey={['1']} bordered={false} style={{ background: "none" }}>
                    <Collapse.Panel key="1" showArrow={false} header={
                        <Typography.Text style={{ width: "100%", textDecoration: "underline", fontStyle: "italic" }}>
                            {t("wallet.setup")}</Typography.Text>
                    }>
                        <Steps direction="vertical" current={currentStep}
                            onChange={(value) => { setCurrentStep(value) }}>

                            <Step title={t("wallet.download")} description={
                                <Typography.Link target="_blank" href={settings.DOWNLOAD_WALLET}>
                                    {t("wallet.download_description")}
                                </Typography.Link>
                            } />

                            <Step title={t("wallet.buy_crypto")} description={
                                <Typography.Link target="_blank" href={settings.BUY_ETH_LINK}>
                                    {t("wallet.buy_crypto_description")}
                                </Typography.Link>
                            } />

                            <Step title={t("wallet.connect_wallet")} description={
                                <Typography.Text onClick={() => { connectWallet() }}
                                    style={{ color: "#177ddc", cursor: "pointer" }}>
                                        {t("wallet.connect_wallet_description")}
                                </Typography.Text>
                            } />
                        </Steps>

                    </Collapse.Panel>
                </Collapse>
            </Col>
        </Card>
    </Row>;
}