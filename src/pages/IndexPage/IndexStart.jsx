import { Row, Col, Typography } from "antd";
import { useState, useEffect, useRef } from "react";
import { Line } from "@ant-design/plots";

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

            xAxis={{ grid: { line: {style: { lineWidth: 0 }} }}}
            yAxis={{ grid: { line: {style: { lineWidth: 0 }} }}}
            interactions={[{ type: 'tooltip', enable: false }]}

            xField="date" yField="price" seriesField="asset"
            legend={{ position: "top" }} smooth={true}
            animation={{ appear: { animation: "path-in", duration: 1000 } }}
            colors={['#00e7eb', "#00eb10", "#eb9c00"]}
        />
    );
};

export default function IndexStart() {
    const allTitles = ["Derivatives", "Indices", "Products", "Safety"];
    const titleColors = ["#eb9c00", "#eb00bb", "#00e7eb", "#00eb10"];
    const [titleIndex, setTitleIndex] = useState(0);
    const titleIntervalId = useRef(null);

    useEffect(
        () => {
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
        <Row id="start" style={{ background: "", height: "90vh" }}>
            <Col span={16}>
                <PriceLines />
            </Col>

            <Col span={7} style={{ display: "flex", paddingTop: "11em", justifyContent: "center" }}>
                <Typography.Title level={1}>
                    Crypto{" "}
                    <div style={{ color: titleColors[titleIndex], transition: "100ms" }} >
                        {allTitles[titleIndex]}
                    </div>
                    For Everyone
                </Typography.Title>
            </Col>
        </Row>
    );
}
