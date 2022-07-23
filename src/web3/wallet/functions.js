import { message } from "antd";
import { hexValue } from "ethers/lib/utils";
import settings from "../../settings";


export class AlreadySendError extends Error {}


export async function addTokenToWallet(provider, token) {
    let symbol = token.symbol;

    if (token.address === token.symbol) {
        symbol = token.address.slice(0, 6) + "...";
    } else if (token.symbol.length > 11) {
        symbol = token.symbol.slice(0, 6) + "...";
    }

    message.info("Check your wallet to add the token");

    return await provider.send('wallet_watchAsset', {
        type: 'ERC20',
        options: {
            address: token.address,
            symbol: symbol,
            decimals: token.decimals,
            image: token.image,
        },
    });
}


export function getNetwork(networkId) {
    if (networkId === settings.NETWORKS.POLYGON.ID) {
        return settings.NETWORKS.POLYGON;
    } else {
        return settings.NETWORKS.ETHEREUM;
    }
}


export function getProductByAddress(products, address){
    for (const product of products) {
        if(product.address === address){
            return product;
        }
    }
}


export async function changeNetwork(provider, networkId) {
    const networkData = getNetwork(networkId);

    try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: hexValue(networkData.ID) }]);
    } catch (error) {
        

        if(error.code === -32002){}
        else if (error.code === 4902) {
            await provider.send('wallet_addEthereumChain', [{
                chainName: networkData.NAME,
                chainId: hexValue(networkData.ID),
                nativeCurrency: networkData.CURRENCY,
                rpcUrls: networkData.URLS,
                blockExplorerUrls: networkData.EXPLORERS,
            }]);
        }else{
            throw error;
        }
    }
}
