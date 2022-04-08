

export function addTokenToWallet(provider, address, symbol, decimals, image) {
    console.log(provider);
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
}
