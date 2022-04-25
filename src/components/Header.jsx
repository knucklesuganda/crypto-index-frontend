import { Fragment } from "react";
import { INDEX_PAGE } from "../routes";
import { Title } from "./Title";


export function Header(props){
    return <Fragment>
        <Title id={props.id}>
            <a href={INDEX_PAGE} style={{ color: "white" }}>Crypto Revolution</a>
        </Title>
        { props.children }
    </Fragment>;
}
