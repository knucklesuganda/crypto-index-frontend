import "./style.css";


export function Fade(props) {
    return <div style={{
        animation: `fade ${props.duration ? props.duration : 400}ms ease-out ${props.isActive ? 'forwards' : 'backwards'}`,
        transition: props.duration,
        display: props.isActive ? "inherit" : "none",
    }}>{props.children}</div>;
}
