import { CSSTransition } from 'react-transition-group';
import "./style.css";


export function Fade(props) {
    return <CSSTransition in={props.isActive} timeout={props.timeout ? props.timeout : 400} classNames="fade" unmountOnExit>
        {props.children}
    </CSSTransition>;
}
