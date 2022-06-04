
const settings = {
    OBSERVER_ADDRESS: process.env.OBSERVER_ADDRESS,
    STATE_UPDATE_INTERVAL: parseInt(process.env.STATE_UPDATE_INTERVAL),
    PUBLIC_RPC_URL: process.env.PUBLIC_RPC_URL,
    DEBUG: process.env.NODE_ENV === 'development',
    CHAIN_ID: process.env.CHAIN_ID,
};

export default settings;
