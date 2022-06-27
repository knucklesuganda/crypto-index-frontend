import { useState, useEffect, useRef } from "react";
import { useIndex } from "./useIndex";
import settings from "../settings";


export function useProductData(productAddress, providerData) {
    const [productData, setProductData] = useState(null);
    const index = useIndex(productAddress, providerData);
    const updateInterval = useRef(null);

    useEffect(() => {
        if (providerData === null || index === null) {
            return;
        }

        index.getInformation().then(product => {
            setProductData(product);
            document.title = `Void | ${product.name}`;
        });

        updateInterval.current = setInterval(() => {
            index.getInformation().then((index) => {
                setProductData(index);
            });
        }, settings.STATE_UPDATE_INTERVAL);

        return () => { clearInterval(updateInterval.current); };
    }, [providerData, productAddress]);

    return { productData, index };
}
