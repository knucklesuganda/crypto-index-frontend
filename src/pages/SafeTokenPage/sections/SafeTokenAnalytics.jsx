import { Fragment } from "react";
import { Loading } from "../../../components";
import { WarningOutlined } from "@ant-design/icons";
import Countdown from "antd/lib/statistic/Countdown";
import { Row, Col, Statistic, Progress, Typography } from "antd";
import { bigNumberToNumber, formatNumber } from "../../../web3/utils";
import { useTranslation } from "react-i18next";


export function SafeTokenAnalytics(props) {
    const { safeTokenData, tokenPrice, isWalletOffline } = props;
    const { t } = useTranslation();

    return <Col style={{
        border: "1px solid #303030", boxShadow: "0 0 5px 2px rgba(255, 255, 255, 0.2)",
        padding: "1em", fontSize: "1.2em", width: "30vw", marginLeft: "10em",
    }}>
        <Typography.Title level={3} style={{ fontWeight: 100, textAlign: "center" }}>
            Analytics
            { isWalletOffline ? <WarningOutlined style={{ marginLeft: "0.5em", color: "#c41717" }} 
                title={t("wallet.offline")} /> : null }
        </Typography.Title>

        <Col style={{ width: "100%" }}>
            {safeTokenData === null ? <Loading /> : <Fragment>
                <Row style={{ display: "flex", justifyContent: "space-between" }}>
                    <Statistic title="Mint supply / Total supply"
                        value={bigNumberToNumber(safeTokenData.mintSupply)}
                        suffix={`/ ${formatNumber(bigNumberToNumber(safeTokenData.totalSupply))} SAFE`} />

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
                        / ${formatNumber(bigNumberToNumber(safeTokenData.userTransferLimit))}`} />
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

    </Col>;
}
