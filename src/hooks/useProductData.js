import settings from "../settings";
import { useState, useEffect, useRef } from "react";
import { getNetwork, getProductByAddress } from "../web3/wallet/functions";


export function useProductData(providerData, productAddress) {
    const [productData, setProductData] = useState(null);
    const [product, setProduct] = useState(null);
    const updateInterval = useRef(null);

    useEffect(() => {
        if(providerData !== null){
            providerData.provider.getNetwork().then(({ chainId }) => {

                const networkData = getNetwork(chainId);
                const foundProduct = getProductByAddress(networkData.PRODUCTS);
                const productInstance = new foundProduct.contract(productAddress, providerData);

                setProduct(productInstance);
            });
        }

        if (providerData === null || product === null) {
            return;
        }

        product.getInformation().then(productInfo => {
            setProductData(productInfo);
            document.title = `Void | ${productInfo.name}`;
        });

        updateInterval.current = setInterval(() => {
            product.getInformation().then((productInfo) => { setProductData(productInfo); });
        }, settings.STATE_UPDATE_INTERVAL);

        return () => { clearInterval(updateInterval.current); };
    }, [providerData, productAddress, product]);

    return { productData, index: product };
}
