import { Fragment } from "react";
import { Loading } from "../../../components";
import { useTranslation } from "react-i18next";
import { WarningOutlined } from "@ant-design/icons";
import Countdown from "antd/lib/statistic/Countdown";
import { Row, Col, Statistic, Progress, Typography } from "antd";
import { bigNumberToNumber, formatNumber } from "../../../web3/utils";
import { useMobileQuery } from "../../../components/MediaQuery";


function TokenUsageProgress(props) {
    return <Progress type="circle" width={250} percent={props.percent}
        strokeColor={props.percent >= 20 ? "green" : "red"}
        format={() => <Statistic title={props.title} style={{ fontSize: "0.7em" }}
            value={`${formatNumber(bigNumberToNumber(props.leftLimit))} 
            / ${formatNumber(bigNumberToNumber(props.totalLimit))}`} />
        } />
}


export function SafeTokenAnalytics(props) {
    const { safeTokenData, tokenPrice, isWalletOffline, isPriceMatic } = props;
    const { t } = useTranslation();
    const isMobile = useMobileQuery();
    const commonRowStyle = {
        display: "flex",
        justifyContent: isMobile ? "center" : "space-between",
        textAlign: isMobile ? "center" : "left",
    };
    const commonEndTextStyles = { textAlign: isMobile ? "center" : "end" };

    return <Col style={{
        padding: "1em",
        fontSize: "1.2em",
        border: "1px solid #303030",
        minWidth: isMobile ? "0" : "30em",
        marginLeft: isMobile ? "0" : "10em",
        borderLeft: isMobile ? "none" : "inherit",
        borderRight: isMobile ? "none" : "inherit",
        boxShadow: "0 0 5px 2px rgba(255, 255, 255, 0.2)",
    }}>
        <Typography.Title level={3} style={{ fontWeight: 100, textAlign: "center" }}>
            Analytics
            {isWalletOffline ? <WarningOutlined style={{ marginLeft: "0.5em", color: "#c41717" }}
                title={t("wallet.offline")} /> : null}
        </Typography.Title>

        <Col style={{ width: "100%" }}>
            {safeTokenData === null ? <Loading /> : <Fragment>
                <Row style={{
                    ...commonRowStyle,
                    justifyContent: "center",
                    marginBottom: isMobile ? "0.5em" : "0",
                    fontSize: "4em",
                    textAlign: 'center',
                }}>
                    <Statistic title={t('buy_product.analytics.balance')} value={
                        safeTokenData !== null && safeTokenData.token.balance !== null ?
                            `${formatNumber(bigNumberToNumber(safeTokenData.token.balance))} SAFE` :
                            t("buy_product.analytics.connect_wallet_balance")
                    } />
                </Row>

                <Row style={commonRowStyle}>
                    <Statistic title={t("safetoken_analytics.mint_total_supply")}
                        value={bigNumberToNumber(safeTokenData.mintSupply)}
                        suffix={`/ ${formatNumber(bigNumberToNumber(safeTokenData.totalSupply))} SAFE`} />

                    <Statistic title={t("safetoken_analytics.mint_price")} suffix={isPriceMatic ? " MATIC" : "$"}
                        value={bigNumberToNumber(tokenPrice)} style={commonEndTextStyles} />
                </Row>

                <Row style={commonRowStyle}>
                    <Statistic title={t("safetoken_analytics.max_transfer")} 
                        value={safeTokenData.maxTransferPercentage} suffix="%" />

                    <Countdown title={safeTokenData.nextResetTime === null ?
                        <Typography.Text style={{ color: "#e61b1b", fontWeight: "bold" }}>
                            {t("safetoken_analytics.start_timer")}
                        </Typography.Text> : t("safetoken_analytics.timer")
                    } value={safeTokenData.nextResetTime} format="HH:mm:ss" style={commonEndTextStyles} />
                </Row>

                <Row style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                    <Col style={{ marginRight: isMobile ? "0" : "1em", marginBottom: isMobile ? "1em" : "0" }}>
                        <TokenUsageProgress title={t("safetoken_analytics.user_usage")}
                            percent={safeTokenData.userLeftPercentage}
                            leftLimit={safeTokenData.userLeftLimit}
                            totalLimit={safeTokenData.userTransferLimit} />
                    </Col>

                    <TokenUsageProgress title={t("safetoken_analytics.total_usage")}
                        percent={safeTokenData.totalLeftPercentage}
                        leftLimit={safeTokenData.totalLeftLimit}
                        totalLimit={safeTokenData.totalTransferLimit} />
                </Row>
            </Fragment>}
        </Col>

    </Col >;
}
