import { message } from 'antd';


function errorEventListener(error) {
    if (error.event !== "changed" && error.reason) {
        message.error(error.message);
    }
}

function disconnectEventListener(){ window.location.reload(); }
function chainChangedEventListener(){
    message.info("Chain was changed");
    window.dispatchEvent(new Event("account_connected"));
}


export function setupEvents(provider) {
    provider.on("error", errorEventListener);
    provider.on("disconnect", disconnectEventListener);
    provider.on('chainChanged', chainChangedEventListener);
    provider.on('accountsChanged', disconnectEventListener);
}

export function unsetEvents() { window.ethereum.removeAllListeners(); }
