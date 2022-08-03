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
    window.ethereum.on("error", errorEventListener);
    window.ethereum.on("disconnect", disconnectEventListener);

    window.ethereum.on('chainChanged', chainChangedEventListener);
    window.ethereum.on('accountsChanged', disconnectEventListener);
}

export function unsetEvents() { window.ethereum.removeAllListeners(); }
