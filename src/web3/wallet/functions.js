
export function getEthereum(){
    return window.ethereum;
}


export function checkWalletIsConnected(){
    return !window.ethereum;
}


export async function reconnectAccount(setAccount){
    const ethereum = getEthereum();
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if(accounts.length !== 0){
        setAccount(accounts[0]);
    }else{
        throw new Error("No connected accounts found");
    }

}


export async function connectWallet(setAccount){

    if(checkWalletIsConnected()){
        throw new Error("No metamask found!");
    }else{

        try{
            const ethereum = getEthereum();
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
        }catch(error){
            throw new Error(error);
        }

    }

}
