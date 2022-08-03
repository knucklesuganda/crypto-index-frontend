
export class WalletConnected extends Event{
    constructor(){ super("wallet_connected"); }
}

export class NetworkChanged extends Event{
    constructor() { super("network_changed"); }
}
