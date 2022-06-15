import { message } from "antd";


export async function addTokenToWallet(provider, token) {
    let symbol = token.symbol;

    if(token.address === token.symbol){
        symbol = token.address.slice(0, 6) + "...";
    }else if(token.symbol.length > 11){
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
