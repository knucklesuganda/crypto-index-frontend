
export function getEthereum() {
    return window.ethereum;
}


export function checkWeb3Connected() {
    return window.ethereum !== undefined && window.ethereum !== null;
}


export async function reconnectAccount() {
    const ethereum = getEthereum();
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
        return accounts[0];
    } else {
        throw new Error("No connected accounts found");
    }

}


export async function connectWallet() {

    try {
        const ethereum = getEthereum();
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        return accounts[0];
    } catch (error) {
        throw new Error(error);
    }

}
