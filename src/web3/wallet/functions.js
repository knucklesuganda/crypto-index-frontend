
export function addTokenToWallet(provider, indexToken) {

    return provider.send('wallet_watchAsset', {
        type: 'ERC20',
        options: {
            address: indexToken.address,
            symbol: indexToken.symbol,
            decimals: indexToken.decimals,
            image: indexToken.image,
        },
    });

}
