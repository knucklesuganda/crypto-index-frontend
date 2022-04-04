import { ArrowDownOutlined } from '@ant-design/icons';


export function NextPage(props) {
    return <ArrowDownOutlined style={{
        marginTop: "2em", fontSize: "2.5em", display: 'flex',
        justifyContent: 'space-around', cursor: "pointer",
    }} onClick={() => { props.setNextPage(); }} />;
} 
