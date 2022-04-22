import { Row, Typography, Col, Button } from "antd";
import { useState, useEffect, useRef, Fragment } from "react";
import { Title } from "../../components/Title";
import { NextPage } from "../../components/NextPage";
import { Fade } from "../../components/animations";


function TextElement(props) {
    return <Fade isActive={props.currentText === props.index}>
        <Typography.Title style={{ fontSize: "4em", textAlign: "center", wordBreak: "keep-all", 
            whiteSpace: "nowrap", height: "40vh"}}>{props.children}</Typography.Title>
    </Fade>;
}


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
                <TextElement currentText={currentText} index={0}>
                    We are a team of developers and financiers that asked a question...
                </TextElement>
                <TextElement currentText={currentText} index={1}>What is the biggest crypto problem?</TextElement>
                <TextElement currentText={currentText} index={2}>We think - Volatility</TextElement>
                <TextElement currentText={currentText} index={3}>And we created something to solve it...</TextElement>
                <TextElement currentText={currentText} index={4}>
                    <Col>
                        <Col>Crypto Finance</Col>
                        <Button type="primary" onClick={() => { setCurrentText(0) }}>Replay</Button>
                    </Col>
                </TextElement>
            </Col>

            <Col span={24}>
                <NextPage setNextPage={props.setNextPage} />
            </Col>
        </Row>
    </Row>;
}
