import "./style.css";


export function Fade(props) {
    const duration = props.duration ? props.duration : '400ms';

    return <div style={{
        animation: `fade ${duration} ease-out ${props.isActive ? 'forwards' : 'backwards'}`,
        transition: duration,
        display: props.isActive ? "inherit" : "none",
    }}>{props.children}</div>;
}
