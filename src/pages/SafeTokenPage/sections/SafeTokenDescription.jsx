import { Col, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useMobileQuery } from "../../../components/MediaQuery";

const { Text, Title } = Typography;


export function SafeTokenDescription() {
    const { t } = useTranslation();
    const isMobile = useMobileQuery();

    return <Col span={isMobile ? 12 : 8} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>{
        t("safetoken").map((entry, index) =>
            <Col key={index} style={{ marginTop: "4em" }}>
                <Title italic style={{ fontWeight: 100 }}>{entry.title}</Title>
                <Text style={{ fontSize: "1.4em" }}>{entry.text}</Text>
            </Col>)
    }</Col>;
}
