import { ArrowDownOutlined } from '@ant-design/icons';
import { OnlyDesktop } from './MediaQuery';


export function NextPage(props) {
    return <OnlyDesktop>
        <ArrowDownOutlined style={{
            transform: props.rotate ? 'rotate(180deg)' : '',
            marginTop: "2em", fontSize: "2.5em", display: 'flex',
            justifyContent: 'space-around', cursor: "pointer",
        }} onClick={() => { props.setNextPage(); }} />
    </OnlyDesktop>;
} 
