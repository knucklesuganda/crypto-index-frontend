import { Col, Typography } from "antd";
import { Modal } from "antd";


function TermsTitle(props){
    return <Typography.Text style={{ fontSize: "1.6em" }}>
        {props.children}
        <br />
    </Typography.Text>;
}


function userAgreementModal(){
    Modal.info({
        title: "Void Management website user agreement",
        width: "60%",
        okText: "I hereby agree to the terms and conditions",
        onOk: () => { localStorage.hasSigned = true; },
        bodyStyle: {
            background: "#0a0a0a",
            border: "1px solid #1f1f1f",
            boxShadow: "4px 4px 20px 0px rgba(255, 255, 255, 0.26)",
        },
        content: <Col>
            <Typography.Text style={{ whiteSpace: "break-spaces", fontSize: "1.2em" }}>
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
                Terms and Agreements
            </Typography.Text>
        </Col>
    });
}


export function UserAgreement(){
    if(!localStorage.hasSigned){
        userAgreementModal();
    }

    return <Typography.Text onClick={userAgreementModal}>User agreement</Typography.Text>;
}
