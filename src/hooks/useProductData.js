import { useState, useEffect, useRef } from "react";
import { getIndexInformation } from "../web3/contracts/IndexContract";
import settings from "../settings";


export function useProductData(productAddress, providerData) {
    const [productData, setProductData] = useState(null);
    const updateInterval = useRef(null);

    useEffect(() => {

        if (providerData !== null) {
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
