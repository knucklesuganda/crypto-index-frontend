import { message } from "antd";


export function addTokenToWallet(provider, address, symbol, decimals, image) {

    try {
        return provider.send('wallet_watchAsset',
            {
                type: 'ERC20',
                options: {
                    address: address,
                    symbol: symbol,
                    decimals: decimals,
                    image: image,
                },
            },
        );

    } catch (error) {
        message.error({
            message: "Error adding token to wallet",
            description: error.message,
        });        
    }

}
