import { reconnectAccount, connectWallet as connectAccount, checkWeb3Connected } from "./wallet/functions";

export async function connectWeb3Account() {

    if(!checkWeb3Connected()){
        throw new Error("Wallet is not connected!");
    }

    try {
        return reconnectAccount();
    } catch (error) {
        return connectAccount();
    }
}
