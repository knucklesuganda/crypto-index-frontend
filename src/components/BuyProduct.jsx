import { ethers } from "ethers";
import { Form, Row, InputNumber, Col, Button, Typography } from "antd";
import { Loading } from "./Loading";
import { createProductPage } from "../routes";
import { useEffect, useState } from "react";
import { useProvider } from "../hooks/useProvider";
import { getIndexInformation } from "../web3/contracts/IndexContract";
import { buyIndex } from "../web3/contracts/IndexContract";
import { formatBigNumber } from "../web3/utils";


export function BuyProduct(props) {
    const { providerData } = useProvider();
    const [productData, setProductData] = useState(null);

    useEffect(() => {

        if (providerData !== null) {
            getIndexInformation(providerData, props.productAddress).then(product => {
                setProductData(product);
            });
        }

        return () => { };
    });

    return <Row style={props.rowStyle}>
        <Col span={24} style={props.columnStyle}>{productData === null ? <Loading /> :
            <Col style={{ paddingLeft: 0, marginBottom: "1em" }}>
                <Row style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Col>
                        <Typography.Title level={2}>
                            <Typography.Link href={createProductPage(productData.address)}>
                                {productData.name}
                            </Typography.Link>
                        </Typography.Title>
                    </Col>

                    <Col><Typography.Title level={4}>{formatBigNumber(productData.price)}$</Typography.Title></Col>
                </Row>

                <Typography.Text>{productData.description}</Typography.Text>
            </Col>
        }
        </Col>

        <Col span={24}>
            <Form name="buyForm" autoComplete="off"
                onFinish={(values) => {
                    buyIndex({
                        providerData,
                        amount: ethers.utils.parseEther(values.amount.toString()),
                        productData
                    });
                }}
                onFinishFailed={(errors) => { }}>

                <Form.Item name="amount" style={{ marginBottom: "1em" }}
                    rules={[{ required: true, message: "Please input the amount" }]}>
                    <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0} size="large" style={{ width: "100%" }} controls={false} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>Buy</Button>
                </Form.Item>
            </Form>
        </Col>
    </Row>;
}
