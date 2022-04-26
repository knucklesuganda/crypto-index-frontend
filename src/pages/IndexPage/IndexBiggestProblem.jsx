import { Row, Typography, Col, Button } from "antd";
import { useState, useEffect, useRef, Fragment } from "react";
import { Title } from "../../components/Title";
import { NextPage } from "../../components/NextPage";
import { Fade } from "../../components/animations";
import { useTranslation } from "react-i18next";


function TextElement(props) {
    return <Fade isActive={props.currentText === props.index}>
        <Typography.Title style={{ fontSize: "4em", textAlign: "center", wordBreak: "keep-all", 
            whiteSpace: "normal", height: "40vh"}}>{props.children}</Typography.Title>
    </Fade>;
}


export function IndexBiggestProblem(props) {
    const totalTexts = 4;
    const [currentText, setCurrentText] = useState(0);
    const { t } = useTranslation();
    const currentTextInterval = useRef(null);
    const pageTexts = t('index.problems.texts');

    useEffect(() => {

        currentTextInterval.current = setInterval(() => {
            if(props.isOpen){
                setCurrentText(currentText + 1 > totalTexts ? currentText : currentText + 1);
            }
        }, 3000);

        return () => { clearInterval(currentTextInterval.current); };
    });


    return <Row>
        <Title id={props.id}>{t('index.problems.title')}</Title>

        <Row style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", paddingTop: "20vh" }}>
            <Col>
                <TextElement currentText={currentText} index={0}>{pageTexts[0]}</TextElement>
                <TextElement currentText={currentText} index={1}>{pageTexts[1]}</TextElement>
                <TextElement currentText={currentText} index={2}>{pageTexts[2]}</TextElement>
                <TextElement currentText={currentText} index={3}>{pageTexts[3]}</TextElement>
                <TextElement currentText={currentText} index={4}>
                    <Col style={{ display: "flex", flexDirection: "column" }}>
                        {t('title')}
                        <Button type="primary" style={{ marginTop: "1em" }} onClick={() => { setCurrentText(0) }}>
                            {t('index.problems.replay')}
                        </Button>
                    </Col>
                </TextElement>
            </Col>

            <Col span={24}>
                <NextPage setNextPage={props.setNextPage} />
            </Col>
        </Row>
    </Row>;
}
