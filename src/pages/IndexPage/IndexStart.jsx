import { Row, Col, Typography, Space, Divider } from "antd";
import { useState, useEffect, useRef } from "react";
import { Line } from "@ant-design/plots";
import { BarChartOutlined, GlobalOutlined, SlidersOutlined } from '@ant-design/icons';
import { NextPage } from "../../components";
import { useTranslation } from "react-i18next";
import { OnlyDesktop, useMobileQuery } from "../../components/MediaQuery";


function PriceLines() {
    return (
        <Line
            data={[
                { date: "2021-01-01", price: 1, asset: "results" },
                { date: "2021-02-01", price: 20, asset: "results" },
                { date: "2021-03-01", price: 30, asset: "results" },
                { date: "2021-04-01", price: 15, asset: "results" },
                { date: "2021-05-01", price: 18, asset: "results" },
                { date: "2021-06-01", price: 20, asset: "results" },
                { date: "2021-07-01", price: 50, asset: "results" },
                { date: "2021-08-01", price: 60, asset: "results" },
                { date: "2021-09-01", price: 80, asset: "results" },
                { date: "2021-10-01", price: 100, asset: "results" },
                { date: "2021-11-01", price: 50, asset: "results" },
                { date: "2022-12-01", price: 140, asset: "results" },
                { date: "2022-01-01", price: 10, asset: "results" },
                { date: "2022-02-01", price: 170, asset: "results" },
                { date: "2022-03-01", price: 200, asset: "results" },

                { date: "2021-01-01", price: 1, asset: "safety" },
                { date: "2021-02-01", price: 12, asset: "safety" },
                { date: "2021-03-01", price: 14, asset: "safety" },
                { date: "2021-04-01", price: 13, asset: "safety" },
                { date: "2021-05-01", price: 15, asset: "safety" },
                { date: "2021-06-01", price: 15, asset: "safety" },
                { date: "2021-07-01", price: 15, asset: "safety" },
                { date: "2021-08-01", price: 17, asset: "safety" },
                { date: "2021-09-01", price: 18, asset: "safety" },
                { date: "2021-10-01", price: 22, asset: "safety" },
                { date: "2021-11-01", price: 17, asset: "safety" },
                { date: "2022-12-01", price: 25, asset: "safety" },
                { date: "2022-01-01", price: 30, asset: "safety" },
                { date: "2022-02-01", price: 40, asset: "safety" },
                { date: "2022-03-01", price: 50, asset: "safety" },

                { date: "2021-01-01", price: 1, asset: "derivatives" },
                { date: "2021-02-01", price: 5, asset: "derivatives" },
                { date: "2021-03-01", price: 10, asset: "derivatives" },
                { date: "2021-04-01", price: 25, asset: "derivatives" },
                { date: "2021-05-01", price: 20, asset: "derivatives" },
                { date: "2021-06-01", price: 10, asset: "derivatives" },
                { date: "2021-07-01", price: 70, asset: "derivatives" },
                { date: "2021-08-01", price: 40, asset: "derivatives" },
                { date: "2021-09-01", price: 50, asset: "derivatives" },
                { date: "2021-10-01", price: 42, asset: "derivatives" },
                { date: "2021-11-01", price: 55, asset: "derivatives" },
                { date: "2022-12-01", price: 56, asset: "derivatives" },
                { date: "2022-01-01", price: 57, asset: "derivatives" },
                { date: "2022-02-01", price: 58, asset: "derivatives" },
                { date: "2022-03-01", price: 59, asset: "derivatives" },
            ]}

            xAxis={{ grid: { line: { style: { lineWidth: 0 } } } }}
            yAxis={{ grid: { line: { style: { lineWidth: 0 } } } }}
            interactions={[{ type: 'tooltip', enable: false }]}

            xField="date" yField="price" seriesField="asset"
            legend={{ position: "top" }} smooth={true}
            animation={{ appear: { animation: "path-in", duration: 4000 } }}
            color={['#00e7eb', "#00eb10", "#eb9c00"]}
        />
    );
};

export function IndexStart(props) {
    const [titleIndex, setTitleIndex] = useState(0);
    const titleIntervalId = useRef(null);
    const { t } = useTranslation();

    const allTitles = t('index.start.crypto_title.titles');
    const titleColors = ["#eb9c00", "#eb00bb", "#00e7eb", "#00eb10"];
    const iconStyle = { display: "flex", fontSize: "4em", justifyContent: "space-around" };
    const isMobile = useMobileQuery();

    useEffect(() => {
        titleIntervalId.current = setInterval(() => {
            const nextTitleIndex = titleIndex + 1;

            if (nextTitleIndex >= allTitles.length) {
                setTitleIndex(0);
            } else {
                setTitleIndex(nextTitleIndex);
            }
        }, 3000);

        return () => {
            clearInterval(titleIntervalId.current);
        };
    },
        [setTitleIndex, titleIndex, allTitles]
    );

    return (
        <Space wrap direction="vertical" style={{ width: "100%" }}>

            <Row style={{ width: "100%", justifyContent: isMobile ? "center" : "inherit" }}>
                <OnlyDesktop>
                    <Col span={16}>
                        <PriceLines />
                        <Typography.Text disabled style={{ paddingLeft: "0.5em" }}>
                            {t('index.start.not_real_data')}
                        </Typography.Text>
                    </Col>
                </OnlyDesktop>

                <Col span={7} style={{
                    display: "flex",
                    paddingTop: isMobile ? "0" : "11em",
                    justifyContent: "center",
                    textAlign: isMobile ? "center" : "inherit",
                }}>
                    <Typography.Title level={1} style={{ margin: 0, padding: 0 }}>
                        {t('index.start.crypto_title.start')}{" "}
                        <div style={{ color: titleColors[titleIndex], transition: "100ms" }} >
                            {allTitles[titleIndex]}
                        </div>
                        {t("index.start.crypto_title.end")}
                    </Typography.Title>
                </Col>
            </Row>

            <Row style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                alignContent: "center",
                placeContent: "space-around",
                marginTop: isMobile ? "1em" : "5em",
            }}>
                {[
                    [<GlobalOutlined style={iconStyle} />, t('index.start.cards.global_solutions')],
                    [<BarChartOutlined style={iconStyle} />, t('index.start.cards.new_derivatives')],
                    [<SlidersOutlined style={iconStyle} />, t("index.start.cards.protect")],
                ].map((data, index) =>
                    <Col key={index} style={isMobile ? {
                        maxWidth: "15em",
                        border: "2px solid #0a0a0a",
                        padding: "1em",
                        marginBottom: "1em",
                        textAlign: "center",
                    } : null}>
                        {data[0]}
                        <Divider />
                        <Typography.Text style={{ fontSize: "1.1em" }}>{data[1]}</Typography.Text>
                    </Col>
                )}
            </Row>

            <NextPage setNextPage={props.setNextPage} />
        </Space>
    );
}
