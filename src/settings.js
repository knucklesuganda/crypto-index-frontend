import { createIndexProductPage, createSafeTokenPage } from "./routes";
import { ERC20Index } from "./web3/contracts/index/erc20Index";
import { EtherIndex } from "./web3/contracts/index/etherIndex";


const STATIC_STORAGE = "https://voidmanagementstorage.blob.core.windows.net";


const settings = {
    DEBUG: false,
    STATE_UPDATE_INTERVAL: 10000,
    DOWNLOAD_WALLET: "https://metamask.io/",
    BUY_ETH_LINK: "https://www.coinbase.com/price/ethereum",
    STATIC_STORAGE,

    NETWORKS: {
        ETHEREUM: {
            NAME: "Ethereum",
            ID: 1,
            CURRENCY: { name: 'ETHEREUM', decimals: 18, symbol: 'ETH' },
            URLS: ["https://eth-mainnet.alchemyapi.io/v2/KQmEoXn9kKfPL4AAljiW1XV39HRHff_K"],
            EXPLORERS: ["https://etherscan.io"],

            PRODUCTS: [
                {
                    image: `${STATIC_STORAGE}/assets/indexBg.png`,
                    text: 'index.crypto_index',
                    url: createIndexProductPage('0xDBCFC1Ec8aF08aB1943aD6dEf907BD0f0b7C4fE0'),
                    contract: ERC20Index,
                },
                {
                    image: `${STATIC_STORAGE}/assets/ethIndexBg.png`,
                    text: 'index.eth_index',
                    url: createIndexProductPage('0x7212569605978ce4cC26489611df873706fbc2A1'),
                    contract: EtherIndex,
                }
            ],

            BUY_TOKEN_LINK: "https://app.uniswap.org/#/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&chain=mainnet",
            MEDIUM_LINK: "https://medium.com/@voidmanagement/crypto-revolution-decentralized-index-c05f45a0efb1#",
            WHITEPAPER: '/whitepaper.pdf',
        },
        POLYGON: {
            NAME: "Polygon",
            ID: 1337,
            CURRENCY: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
            URLS: ['127.0.0.1:8545'],
            // URLS: ["https://polygon-rpc.com/"],
            EXPLORERS: ["https://polygonscan.com"],

            PRODUCTS: [
                {
                    image: `${STATIC_STORAGE}/assets/indexBg.png`,
                    text: 'index.safe_token',
                    url: createSafeTokenPage('0xF8cC94BCDe449e1a8F0E34717acd823fF8402b07'),
                    contract: ERC20Index,
                }
            ],

            BUY_TOKEN_LINK: "https://app.uniswap.org/#/swap&chain=polygon",
            MEDIUM_LINK: "https://medium.com/@voidmanagement/crypto-revolution-decentralized-index-c05f45a0efb1#",
            WHITEPAPER: '/whitepaper.pdf',
        },
    },
};

export default settings;
