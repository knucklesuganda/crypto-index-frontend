import { useDesktopQuery, useHalfScreenQuery } from "../../components/MediaQuery";
import { Row, Col, Typography, Image } from "antd";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createProductPage } from "../../routes";
import settings from "../../settings";
import { Loading } from "../../components";
import "./style.css";


const { Text, Link } = Typography;


function ProductCard(props) {
    const navigate = useNavigate();
    const { isDesktop } = props;
    const [isLoaded, setIsLoaded] = useState(false);
    const imageSize = { width: isDesktop ? "85wh" : "85wh", height: isDesktop ? "35vh" : "25vh" };

    return <Col className="productCard" onClick={() => { if (isLoaded) { navigate(props.url); } }}
        style={{ cursor: isLoaded ? "pointer" : "inherit", marginBottom: isDesktop ? "0" : "2em" }}>

        {isLoaded ? null : <Col style={{ position: "absolute", ...imageSize }}>
            <Loading />
        </Col>}

        <Image className="productCardImage" style={{
            zIndex: 1,
            ...imageSize,
            borderRadius: "24px",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "initial",
            backgroundPosition: "center",
            border: "1px solid white",
            boxShadow: "5px 5px 50px 40px black",
            display: isLoaded ? "inherit" : "none",
        }} src={props.image} preview={false} alt={props.text} onLoad={() => { setIsLoaded(true) }} />

        {isLoaded ? <Text className="productCardText">{props.text}</Text> : null}
    </Col>;
}


export default function IndexPage() {
    const { t } = useTranslation();
    const isDesktop = useDesktopQuery();
    const isHalfScreen = useHalfScreenQuery();
    document.body.className = 'indexBackground';

    return <Col style={{
        display: "flex",
        justifyContent: isHalfScreen ? "flex-start" : "space-between",
        flexDirection: isHalfScreen ? "row" : "column",
        paddingRight: isDesktop ? "1em" : "0",
        paddingTop: isDesktop ? "5em" : "0.5em",
        paddingLeft: isDesktop ? "10em" : "0",
        alignItems: isDesktop ? "flex-start" : "center",
        height: isDesktop ? "80vh" : "inherit",
    }}>
        <Row style={{ display: "flex", justifyContent: "space-between", width: "80vw" }}>
            <ProductCard image={`${settings.STATIC_STORAGE}/assets/indexBg.png`}
                text={t('index.crypto_index')} isDesktop={isDesktop}
                url={createProductPage('index', settings.PRODUCTS.INDEX_ADDRESS)} />

            <ProductCard image={`${settings.STATIC_STORAGE}/assets/ethIndexBg.png`}
                text={t('index.eth_index')} isDesktop={isDesktop}
                url={createProductPage('index', settings.PRODUCTS.ETH_INDEX_ADDRESS)} />
        </Row>

        <Row style={{
            fontWeight: "100",
            display: "flex",
            flexDirection: "column",
            alignItems: isDesktop ? "flex-start" : "center",
            marginTop: isDesktop ? (isHalfScreen ? "0em" : "15em") : "0",
        }}>
            <Text style={{ fontSize: isDesktop ? "4.8em" : "3.5em", textAlign: isDesktop ? "inherit" : "center" }}>
                <b style={{ fontWeight: "bolder" }}>{t("index.void")}</b> {t("index.crypto_index")}
            </Text>

            {isDesktop ? <Text style={{ fontSize: "2em" }}>{t("index.description")}</Text> : null}

            <Link style={{ fontSize: "1.5em", marginBottom: "0.5em" }} href={settings.MEDIUM_LINK}>
                {t("index.read_medium")}</Link>

            <Link style={{ fontSize: "1.5em", background: "black" }} href='/whitepaper.pdf'>
                {t("index.whitepaper")}</Link>
        </Row>

    </Col>;
}
