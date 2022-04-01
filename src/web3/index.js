import { reconnectAccount, connectWallet } from "./wallet/functions";

export async function addAccount(setAccount) {
    try {
        reconnectAccount(setAccount);
    } catch (error) {
        connectWallet(setAccount);
    }
}
