import { useState, useEffect, useRef } from "react";
import { getIndexInformation as getIndexInformation_ } from "../web3/contracts/IndexContract";
import { getIndexInformation as getETHIndexInformation } from "../web3/contracts/EthIndexContract";
import settings from "../settings";


export function useProductData(productAddress, providerData, productType) {
    const [productData, setProductData] = useState(null);
    const updateInterval = useRef(null);


    useEffect(() => {
        if (productType !== undefined && providerData !== null) {
            let getIndexInformation = getIndexInformation_;

            if(productType === "eth_index"){
                getIndexInformation = getETHIndexInformation;
            }

            getIndexInformation(providerData, productAddress).then(product => {
                setProductData(product);
                document.title = `Void | ${product.name}`;
            });

            updateInterval.current = setInterval(() => {
                getIndexInformation(providerData, productAddress).then(product => {
                    setProductData(product);
                });
            }, settings.STATE_UPDATE_INTERVAL);
        }

        return () => { clearInterval(updateInterval.current); };
    }, [providerData, productAddress]);

    return productData;
}
