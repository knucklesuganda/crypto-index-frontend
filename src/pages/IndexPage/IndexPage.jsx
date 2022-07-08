import { Fragment } from "react";
import { useDesktopQuery } from "../../components/MediaQuery";
import { Row, Col, Typography, Image } from "antd";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import settings from "../../settings";
import "./style.css";
import { createProductPage } from "../../routes";


const { Text, Link } = Typography;


function ProductCard(props) {
    const navigate = useNavigate();
    const { isDesktop } = props;

    return <Col onClick={() => { navigate(props.url) }} className="productCard" style={{
        marginBottom: isDesktop ? "0" : "2em",
    }}>
        <Image className="productCardImage" style={{
            width: isDesktop ? "85wh" : "85wh",
            height: isDesktop ? "35vh" : "25vh",
            borderRadius: "24px",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "initial",
            backgroundPosition: "center",
            border: "1px solid white",
            boxShadow: "5px 5px 50px 40px black",
            zIndex: 1,
        }} src={props.image} preview={false} />

        <Text className="productCardText">{props.text}</Text>
    </Col>;
}


export default function IndexPage() {
    const isDesktop = useDesktopQuery();
    const { t } = useTranslation();
    document.body.style.backgroundImage = "url('/images/background.png')";

    return <Col style={{
        paddingRight: isDesktop ? "1em" : "0",
        paddingTop: isDesktop ? "5em" : "0.5em",
        paddingLeft: isDesktop ? "10em" : "0",
        alignItems: isDesktop ? "flex-start" : "center",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: isDesktop ? "80vh" : "inherit",
    }}>
        <Row style={{ display: "flex", justifyContent: "space-between", width: "80vw" }}>
            <ProductCard image="/images/indexBg.png" text={t('index.crypto_index')} isDesktop={isDesktop}
                url={createProductPage('index', '0xDBCFC1Ec8aF08aB1943aD6dEf907BD0f0b7C4fE0')} />
            <ProductCard image="/images/ethIndexBg.png" text={t('index.eth_index')} isDesktop={isDesktop}
                url={createProductPage('index', '0x7212569605978ce4cC26489611df873706fbc2A1')} />
        </Row>

        <Row style={{
            fontWeight: "100",
            display: "flex",
            flexDirection: "column",
            alignItems: isDesktop ? "flex-start" : "center",
            marginTop: isDesktop ? "15em" : "0",
        }}>
            <Text style={{ fontSize: isDesktop ? "4.8em" : "3.5em" }}>
                <b style={{ fontWeight: "bolder" }}>{t("index.void")}</b> {t("index.crypto_index")}
            </Text>

            {isDesktop ? <Text style={{ fontSize: "2em" }}>{t("index.description")}</Text> : null}

            <Link style={{ fontSize: "1.5em", marginBottom: "0.5em" }} href={settings.MEDIUM_LINK}>
                {t("index.read_medium")}</Link>

            <Link style={{ fontSize: "1.5em" }} href='/whitepaper.pdf'>{t("index.whitepaper")}</Link>
        </Row>

    </Col>;
}
