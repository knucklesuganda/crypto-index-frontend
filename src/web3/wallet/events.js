

export async function setupEvents(provider){

    provider.on("accountsChanged", (accounts) => {
        console.log(accounts);
    });

    provider.on("chainChanged", (chainId) => {
        console.log(chainId);
    });
    
    provider.on("connect", (info) => {
        console.log(info);
    });
    
    provider.on("disconnect", (error) => {
        console.log(error);
    });    

}
