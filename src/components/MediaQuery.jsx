import MediaQuery, { useMediaQuery } from "react-responsive";



export function OnlyDesktop(props){
    return <MediaQuery minWidth="480px">{props.children}</MediaQuery>;
}


export function MobileOnly(props){
    return <MediaQuery maxWidth="480px">{props.children}</MediaQuery>; 
}


export function useHalfScreenQuery(){
    return useMediaQuery({ query: '(max-width: 1490px and min-width: 480px)' });
}


export function useMobileQuery(){
    return useMediaQuery({ query: '(max-width: 480px)' });
}


export function useDesktopQuery(){
    return useMediaQuery({ query: '(min-width: 480px)' });
}
