import { createIndexProductPage, SAFETOKEN_PRODUCT_PAGE } from "./routes";
import { ERC20Index } from "./web3/contracts/index/erc20Index";
import { EtherIndex } from "./web3/contracts/index/etherIndex";
import { SafeMinter } from "./web3/contracts/safe_token";


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
            URL: "https://eth-mainnet.alchemyapi.io/v2/KQmEoXn9kKfPL4AAljiW1XV39HRHff_K",
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
            WHITEPAPER: `${STATIC_STORAGE}/assets/whitepaper.pdf`,

            WHITEPAPER_TEXT: "index.whitepaper",
            INDEX_DESCRIPTION: "index.description",
            INDEX_TITLE: "index.crypto_index",
            MEDIUM_TEXT: "index.read_medium",
        },
        POLYGON: {
            NAME: "Polygon",
            ID: 137,
            CURRENCY: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
            URL: "https://polygon-mainnet.g.alchemy.com/v2/ek0APUF__-zEjcBGit2XoTgGiQ-6eqc_",
            EXPLORERS: ["https://polygonscan.com"],

            PRODUCTS: [
                {
                    image: `${STATIC_STORAGE}/assets/safe_token_bg.png`,
                    text: 'index.safe_token',
                    url: SAFETOKEN_PRODUCT_PAGE,
                    address: '0xc040A60288Fc432E98274caC7ceD28Ca78789720',
                    contract: SafeMinter,
                }
            ],

            BUY_TOKEN_LINK: "https://app.uniswap.org/#/swap&chain=polygon",
            MEDIUM_LINK: "https://medium.com/@voidmanagement/safe-token-everyone-hodls-b1032eb84a23",
            WHITEPAPER: `${STATIC_STORAGE}/assets/whitepaper_safetoken.pdf`,

            WHITEPAPER_TEXT: "index.polygon_whitepaper",
            INDEX_DESCRIPTION: "index.polygon_description",
            INDEX_TITLE: "index.polygon_safe_token",
            MEDIUM_TEXT: "index.polygon_read_medium"
        },
    },
};

export default settings;
