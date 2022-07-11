import settings from "../../../settings";
import { ERC20Index } from "../index/erc20Index";
import { EtherIndex } from "../index/etherIndex";


export async function createIndex(address, providerData){

    if(address === settings.PRODUCTS.INDEX_ADDRESS){
        return new ERC20Index(address, providerData);
    }else if(address === settings.PRODUCTS.ETH_INDEX_ADDRESS){
        return new EtherIndex(address, providerData);
    }

}
