
const settings = {
    OBSERVER_ADDRESS: process.env.REACT_APP_OBSERVER_ADDRESS,
    STATE_UPDATE_INTERVAL: parseInt(process.env.REACT_APP_STATE_UPDATE_INTERVAL),
    PUBLIC_RPC_URL: process.env.REACT_APP_PUBLIC_RPC_URL,
    DEBUG: process.env.REACT_APP_DEBUG,
    CHAIN_ID: process.env.REACT_APP_CHAIN_ID,
    BUY_DAI_LINK: process.env.REACT_APP_BUY_DAI_LINK,
    MEDIUM_LINK: process.env.REACT_APP_MEDIUM_LINK,
};

export default settings;
