import settings from "../settings";
import { useState, useEffect, useRef } from "react";
import { getNetwork, getProductByAddress } from "../web3/wallet/functions";


export function useProductData(providerData, productAddress) {
    const [productData, setProductData] = useState(null);
    const [product, setProduct] = useState(null);
    const updateInterval = useRef(null);

    useEffect(() => {
        const cleanupFunction = () => { clearInterval(updateInterval.current); };

        if(!providerData){
            return cleanupFunction;
        }

        if(!product){
            providerData.provider.getNetwork().then(({ chainId }) => {
                const networkData = getNetwork(chainId);
                const foundProduct = getProductByAddress(networkData.PRODUCTS);

                if(!foundProduct){
                    return cleanupFunction;
                }

                const productInstance = new foundProduct.contract(productAddress, providerData);
                setProduct(productInstance);
            }).catch();
        }else{
            product.getInformation().then(productInfo => {
                setProductData(productInfo);
                document.title = `Void | ${productInfo.name}`;
            });

            updateInterval.current = setInterval(() => {
                product.getInformation().then((productInfo) => { setProductData(productInfo); });
            }, settings.STATE_UPDATE_INTERVAL);
        }

        return cleanupFunction;
    }, [providerData, productAddress, product]);

    return { productData, product };
}
