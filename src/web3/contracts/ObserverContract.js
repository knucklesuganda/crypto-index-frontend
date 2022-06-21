import { ethers } from "ethers";
import { getIndexShortInfo } from "./IndexContract";
import contract from './sources/Observer.json';

const ObserverABI = contract.abi;


export function createObserver(providerData, observerAddress) {
    return new ethers.Contract(observerAddress, ObserverABI, providerData.signer);
}


export async function listProducts(providerData, observerAddress) {

    const observer = createObserver(providerData, observerAddress);
    const productsList = [];

    for (let product of await observer.getProducts()) {
        let productInfo;

        if (product.productType === 'index' || product.productType === 'eth_index') {
            productInfo = await getIndexShortInfo(providerData, product.productAddress);
        }

        productsList.push(productInfo);
    }

    return productsList;
}


export async function getProductType(providerData, observerAddress, productAddress) {
    const observer = createObserver(providerData, observerAddress);
    const products = await observer.getProducts();

    for(let product of products) {
        if (product.productAddress === productAddress) {
            return product.productType;
        }
    }
}


export async function checkProductExists(providerData, observerAddress, productAddress) {
    return await createObserver(providerData, observerAddress).checkProductExists(productAddress);
}
