import { Row, Card, Typography, Button, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";


export function WalletConnector(props) {
    const [isHidden, setIsHidden] = useState(false);
    const { t } = useTranslation();

    return <Row gutter={[25, 55]} style={{
        display: isHidden ? "none" : "flex", paddingLeft: "1em", rowGap: "10px", columnGap: "10px",
    }}>
        <Row style={{ width: "100%", zIndex: -1, filter: "blur(4px)" }}>
            {props.placeholder}
        </Row>

        <Row style={{
            position: "absolute", zIndex: 10,
            left: "40%", right: "50%", top: "20%", bottom: "50%",
            marginLeft: "auto", marginRight: "auto", textAlign: "center",
        }}>
            <Card style={{ boxShadow: "3px 3px 84px 0px rgba(255, 255, 255, 0.2)" }}>
                <Typography.Text style={{ fontSize: "1.2em" }}>
                    You must connect your wallet in order to buy products
                </Typography.Text>

                <Button type="primary" size="large" style={{ width: "20em", marginTop: "1em" }}
                    onClick={() => {
                        setIsHidden(true);

                        props.handleWalletConnection().catch((error) => {
                            message.error(t("wallet_connector.no_provider_error"));
                            setIsHidden(false);
                        });

                    }}>Connect account</Button>
            </Card>
        </Row>
    </Row>
}