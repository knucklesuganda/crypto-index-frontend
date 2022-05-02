import { Avatar, List, Typography } from "antd";
import { QuestionOutlined } from "@ant-design/icons";


export function ProductInfo(props){
    // TODO: translatoin

    return <div>
        <Typography.Title>Frequently asked questions</Typography.Title>

        <List itemLayout="horizontal" dataSource={props.data} renderItem={item => (
            <List.Item>
                <List.Item.Meta avatar={
                    <Avatar icon={
                        <QuestionOutlined style={{ fontSize: "1.2em" }} />
                    } />
                }
                title={<Typography.Text style={{ fontWeight: "bold",
                    fontSize: "1.2em" }}>{item.question}</Typography.Text>}
                description={item.answer} />
            </List.Item>
        )} />
    </div>;
}
