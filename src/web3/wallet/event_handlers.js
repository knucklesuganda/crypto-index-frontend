import { message } from 'antd';
import { NetworkChanged } from './events';


function errorEventListener(error) {
    if (error.event !== "changed" && error.reason) {
        message.error(error.message);
    }
}

function disconnectEventListener(){ window.location.reload(); }
function chainChangedEventListener(){
    message.info("Chain was changed");
    window.dispatchEvent(new NetworkChanged());
}


export function setupEvents(provider) {
    if(window.ethereum){
        provider = window.ethereum;
    }

    provider.on("error", errorEventListener);
    provider.on("disconnect", disconnectEventListener);

    provider.on('chainChanged', chainChangedEventListener);
    provider.on('accountsChanged', disconnectEventListener);
}

export function unsetEvents() {
    if(window.ethereum) {
        window.ethereum.removeAllListeners();
    }
}
