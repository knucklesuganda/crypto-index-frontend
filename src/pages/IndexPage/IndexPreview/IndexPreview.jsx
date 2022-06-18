import { Row, Typography, Col, Image, Table } from "antd";
import { Title } from "../../../components/Title";
import { NextPage } from "../../../components/NextPage";
import { useTranslation } from "react-i18next";
import { useMobileQuery } from "../../../components/MediaQuery";
import { Fragment, useRef, useState } from "react";
import { Fade } from "../../../components/animations";
import "./style.css";


function CryptoLogo(props) {
    return <Col style={{
        marginTop: "2em",
        display: "flex",
        justifyContent: "center",
        filter: props.isHover ? "grayscale(1)" : null,
        transition: "200ms",
    }}>
        <Fade isActive duration={props.duration}>
            <Image preview={false} src={props.src} style={{
                width: props.width ? props.width : "12em",
                transform: props.isHover ? "scale(0.95)" : "scale(1)",
                transition: "200ms",
            }} />
        </Fade>
    </Col>;
}

function Text(props) {
    return <Typography.Text style={{
        color: props.color,
        fontSize: "2.5em",
        display: "flex",
        justifySelf: "center",
        whiteSpace: "pre-wrap",
        transition: "200ms",
        textShadow: `0 0 15px ${props.shadowColor}`,
        textAlign: props.align,
    }}>{props.children}</Typography.Text>;
}


export function IndexPreview(props) {
    const { t } = useTranslation();
    const previewRef = useRef();
    const [otherVisible, setOtherVisible] = useState(false);
    const [indexVisible, setIndexVisible] = useState(false);
    const isMobile = useMobileQuery();

    return <Row style={{ justifyContent: isMobile ? "center" : "inherit", width: "100%" }} ref={previewRef}>
        <Title id={props.id}>{t('index.preview.title')}</Title>

        {isMobile ?
            <Table style={{ marginTop: "2em", marginBottom: "4em" }}

            dataSource={[
                {
                    key: "1", 
                    token: <span style={{ color: "red" }}>{t('index.preview.tokens.fees')}</span>,
                    index: <span style={{ color: "green" }}>{t('index.preview.index.fees')}</span>,
                },
                {
                    key: "2", 
                    token: <span style={{ color: "red" }}>{t('index.preview.tokens.management')}</span>,
                    index: <span style={{ color: "green" }}>{t('index.preview.index.management')}</span>,
                },
                {
                    key: "3", 
                    token: <span style={{ color: "red" }}>{t('index.preview.tokens.transactions')}</span>,
                    index: <span style={{ color: "green" }}>{t('index.preview.index.transactions')}</span>,
                },
            ]}
            columns={[
                { title: t('index.preview.tokens.title'), dataIndex: 'token', key: 'token' },
                { title: t('index.preview.index.title'), dataIndex: 'index', key: 'index' },
            ]}
            pagination={false} />
            :
            <Row style={{ width: "100%", marginBottom: "5em" }}>
                <Col span={6} style={{ display: "flex", justifyContent: "flex-start", flexDirection: "column" }}
                    onMouseEnter={() => { setOtherVisible(true) }}
                    onMouseLeave={() => { setOtherVisible(false) }}>

                    <CryptoLogo duration='200ms'
                        src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=022"
                        isHover={otherVisible} />

                    <CryptoLogo duration='450ms' width="8em"
                        src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022"
                        isHover={otherVisible} />

                    <CryptoLogo duration='650ms'
                        src="https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=022"
                        isHover={otherVisible} />
                </Col>

                <Col span={12} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                }}>
                    {otherVisible ? <Fragment>
                        <Text color="red" shadowColor="rgba(255, 0, 0, 0.7)">{t('index.preview.tokens.fees')}</Text>
                        <Text color="red" shadowColor="rgba(255, 0, 0, 0.7)">{t('index.preview.tokens.management')}</Text>
                        <Text color="red" shadowColor="rgba(255, 0, 0, 0.7)">{t('index.preview.tokens.transactions')}</Text>
                    </Fragment> : null}

                    {indexVisible ? <Fragment>
                        <Text color="green" shadowColor="rgba(0, 255, 0, 0.7)">
                            {t('index.preview.index.fees')}</Text>

                        <Text color="green" shadowColor="rgba(0, 255, 0, 0.7)">
                            {t('index.preview.index.management')}</Text>

                        <Text color="green" shadowColor="rgba(0, 255, 0, 0.7)">
                            {t('index.preview.index.transactions')}</Text>

                    </Fragment> : null}
                </Col>

                <Col span={6} style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                }} onMouseEnter={() => { setIndexVisible(true) }} onMouseLeave={() => { setIndexVisible(false) }}>
                    <CryptoLogo duration='200ms' width="35em" isHover={indexVisible} src="/images/indexLogo.svg" />
                </Col>
            </Row>
        }

        <Col style={{ justifyContent: "center", width: "100%", display: "flex" }}>
            <Typography.Link target="_blank" style={{
                color: "white",
                fontSize: isMobile ? "1em" : "1.7em",
                textDecoration: "underline",
            }} href="https://medium.com/@voidmanagement/crypto-revolution-decentralized-index-c05f45a0efb1">
                {t('index.preview.medium')}
            </Typography.Link>
        </Col>

        <Col span={24}><NextPage setNextPage={props.setNextPage} /></Col>
    </Row>;
}
