
export async function addTokenToWallet(provider, indexToken) {
    return await provider.send('wallet_watchAsset', {
        type: 'ERC20',
        options: {
            address: indexToken.address,
            symbol: indexToken.symbol,
            decimals: indexToken.decimals,
            image: indexToken.image,
        },
    });
}
