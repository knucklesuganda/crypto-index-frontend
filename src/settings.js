
const settings = {
    DEBUG: false,
    STATE_UPDATE_INTERVAL: 10000,
    PUBLIC_RPC_URL: "https://eth-mainnet.alchemyapi.io/v2/KQmEoXn9kKfPL4AAljiW1XV39HRHff_K",
    BUY_DAI_LINK: "https://app.uniswap.org/#/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&chain=mainnet",
    MEDIUM_LINK: "https://medium.com/@voidmanagement/crypto-revolution-decentralized-index-c05f45a0efb1#",
    BUY_ETH_LINK: "https://www.coinbase.com/price/ethereum",
    DOWNLOAD_WALLET: "https://metamask.io/",
    STATIC_STORAGE: "https://voidmanagementstorage.blob.core.windows.net",

    NETWORKS: {
        ETHEREUM: {
            NAME: "Ethereum",
            ID: 1,
            CURRENCY: { name: 'ETHEREUM', decimals: 18, symbol: 'ETH' },
            URLS: [],
        },
        POLYGON: {
            NAME: "Polygon",
            ID: 137,
            CURRENCY: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
            URLS: ["https://polygon-rpc.com/"],
        },
    },

    PRODUCTS: {
        INDEX_ADDRESS: '0xDBCFC1Ec8aF08aB1943aD6dEf907BD0f0b7C4fE0',
        ETH_INDEX_ADDRESS: '0x7212569605978ce4cC26489611df873706fbc2A1',
    },
};

export default settings;
