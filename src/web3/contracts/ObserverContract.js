import { ethers } from "ethers";
import { getIndexInformation } from "./IndexContract";
import contract from './sources/Observer.json';

const ObserverABI = contract.abi;


export function createObserver(providerData, observerAddress) {
    return new ethers.Contract(observerAddress, ObserverABI, providerData.signer);
}


export async function listProducts(providerData, observerAddress) {

    const observer = createObserver(providerData, observerAddress);
    const productsList = [];

    for(let product of await observer.getProducts()){
        let productInfo;

        if(product.productType === 'index'){
            productInfo = await getIndexInformation(providerData, product.productAddress);
        }

        productsList.push(productInfo);
    }

    return productsList;
}
