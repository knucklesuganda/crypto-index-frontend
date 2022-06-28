import { ethers } from "ethers";
import { ERC20Index } from "../index/erc20Index";
import { EtherIndex } from "../index/etherIndex";
import ObserverABI from '../sources/Observer.json';


export class Observer {

    constructor(address, providerData) {
        this.observer = new ethers.Contract(address, ObserverABI.abi, providerData.signer);
        this.address = address;
        this.providerData = providerData;
    }

    async listProducts() {
        const productsList = [];

        for (let product of await this.observer.getProducts()) {
            let productInfo;

            if (product.productType === 'index') {
                const index = new ERC20Index(product.productAddress, this.providerData);
                productInfo = await index.getInformation();
            }else if(product.productType === 'eth_index'){
                const index = new EtherIndex(product.productAddress, this.providerData);
                productInfo = await index.getInformation();
            }

            productsList.push(productInfo);
        }

        return productsList;
    }

    async getProductType(address) {
        const products = await this.observer.getProducts();

        for (let product of products) {
            if (product.productAddress === address) {
                return product.productType;
            }
        }
    }

    async checkProductExists(productAddress) {
        return this.observer.checkProductExists(productAddress);
    }

}
