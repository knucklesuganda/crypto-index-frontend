import {Row, Col, Typography} from "antd";
import {useState, useEffect, useRef} from "react";
import {Line} from "@ant-design/plots";

const DemoLine = () => {
    return (
        <Line
            data={[1, 2, 3]}
            xField="year"
            yField="gdp"
            seriesField="name"
            yAxis={{
                label: {formatter: value => `${(value / 10e8).toFixed(1)} B`}
            }}
            legend={{position: "top"}}
            smooth={true}
            animation={{appear: {animation: "path-in", duration: 5000}}}
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

                console.log(nextTitleIndex);
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
        <Row id="start" style={{background: "", height: "90vh"}}>
            <Col span={16} />

            <Col span={7} style={{paddingTop: "20em", paddingRight: "10em"}}>
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
