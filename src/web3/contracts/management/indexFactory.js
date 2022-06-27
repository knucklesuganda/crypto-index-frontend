import settings from "../../../settings";
import { ERC20Index } from "../index/erc20Index";
import { EtherIndex } from "../index/etherIndex";
import { Observer } from "./observer";


export async function createIndex(address, providerData){

    const observer = new Observer(settings.OBSERVER_ADDRESS, providerData);
    const productType = await observer.getProductType(address);

    if(productType === "index"){
        return new ERC20Index(address, providerData);
    }else if(productType === "eth_index"){
        return new EtherIndex(address, providerData);
    }

}
