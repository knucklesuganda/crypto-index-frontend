import { Row } from "antd";
import { Title } from "../../components/Title";
import { NextPage } from "../../components/NextPage";


export function IndexAboutUs(props){
    return <Row>
        <Title id={props.id}>About us</Title>
        <NextPage setNextPage={props.setNextPage} />
    </Row>;
}
