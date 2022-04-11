import { Modal } from "antd";
import { BuyProduct } from "./BuyProduct";

export function BuyModal(props) {
    const [isOpen, setIsOpen] = props.state;

    return <Modal title='Buy product' visible={isOpen} onCancel={() => { setIsOpen(false); }} footer={null}>
        <BuyProduct rowStyle={{
            width: "100wv",
            display: "flex",
            flexDirection: "column",
            alignContent: "space-around",
            justifyContent: "space-between",
            placeContent: "center",
        }} columnStyle={{
            display: "flex", placeContent: "center", direction: "column",
            alignItems: "center", justifyContent: "center"
        }} productAddress={props.productAddress} />
    </Modal>;
}
