
const settings = {
    STATE_UPDATE_INTERVAL: parseInt(process.env.REACT_APP_STATE_UPDATE_INTERVAL),
    PUBLIC_RPC_URL: process.env.REACT_APP_PUBLIC_RPC_URL,
    DEBUG: process.env.REACT_APP_DEBUG,
    CHAIN_ID: process.env.REACT_APP_CHAIN_ID,
    BUY_DAI_LINK: process.env.REACT_APP_BUY_DAI_LINK,
    MEDIUM_LINK: process.env.REACT_APP_MEDIUM_LINK,

    PRODUCTS: {
        INDEX_ADDRESS: '0x0BAd1982d6A4e056B358a9DC84b7F81CdC1a4F76', //'0xDBCFC1Ec8aF08aB1943aD6dEf907BD0f0b7C4fE0',
        ETH_INDEX_ADDRESS: '0x7212569605978ce4cC26489611df873706fbc2A1',
    },
};

export default settings;
