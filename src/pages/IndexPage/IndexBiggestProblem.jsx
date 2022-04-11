import { Row, Typography, Col, Button } from "antd";
import { useState, useEffect, useRef } from "react";
import { Title } from "../../components/Title";
import { NextPage } from "../../components/NextPage";
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Zoom';


export function IndexBiggestProblem(props) {
    const totalTexts = 4;
    const [currentText, setCurrentText] = useState(0);
    const currentTextInterval = useRef(null);

    useEffect(() => {

        currentTextInterval.current = setInterval(() => {
            setCurrentText(currentText + 1 > totalTexts ? currentText : currentText + 1);
        }, 4000);

        return () => { clearInterval(currentTextInterval.current); };
    });


    return <Row>
        <Title id={props.id}>Biggest problem</Title>

        <Row style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", paddingTop: "20vh" }}>
            <Col>
                <Typography.Title style={{
                    fontSize: "4em", textAlign: "center",
                    wordBreak: "keep-all", whiteSpace: "nowrap",
                    height: "40vh",
                }}>
                    <Zoom cascade collapse when={currentText === 0}>
                        We are a team of developers and financiers that asked a question...
                    </Zoom>
                    <Zoom cascade collapse when={currentText === 1}>What is the biggest crypto problem?</Zoom>
                    <Zoom cascade collapse when={currentText === 2}>We think - Volatility</Zoom>
                    <Zoom cascade collapse when={currentText === 3}>And we created something to solve it...</Zoom>
                    <Zoom cascade collapse when={currentText === 4}>Crypto Finance</Zoom>

                    {currentText === 4 && <Fade>
                        <Button type="primary" onClick={() => { setCurrentText(0) }}>Replay</Button>
                    </Fade>}
                </Typography.Title>
            </Col>

            <Col span={24}>
                <NextPage setNextPage={props.setNextPage} />
            </Col>
        </Row>
    </Row>;
}
