import { ethErrors } from 'eth-rpc-errors';

import ReadyPromise from '@/content-script/pageProvider/readyPromise';
import BroadcastChannelMessage from '@/shared/utils/message/broadcastChannelMessage';
import Web3API from '@/shared/web3/Web3API';

import { OpnetProvider } from './index';

class PushEventHandlers {
    provider: OpnetProvider;

    _unisatProviderPrivate: any;

    constructor(
        provider: OpnetProvider,
        _opnetProviderPrivate: {
            _selectedAddress: string | null;
            _network: string | null;
            _isConnected: boolean;
            _initialized: boolean;
            _isUnlocked: boolean;
            _pushEventHandlers: PushEventHandlers | null;
            _requestPromise: ReadyPromise;
            _bcm: BroadcastChannelMessage;
        }
    ) {
        this.provider = provider;
        this._unisatProviderPrivate = _opnetProviderPrivate;
    }

    _emit(event: string, data: object) {
        if (this._unisatProviderPrivate._initialized) {
            this.provider.emit(event, data);
        }
    }

    connect = (data: object) => {
        if (!this._unisatProviderPrivate._isConnected) {
            this._unisatProviderPrivate._isConnected = true;
            this._unisatProviderPrivate._state.isConnected = true;
            this._emit('connect', data);
        }
    };

    unlock = () => {
        this._unisatProviderPrivate._isUnlocked = true;
        this._unisatProviderPrivate._state.isUnlocked = true;
    };

    lock = () => {
        this._unisatProviderPrivate._isUnlocked = false;
    };

    disconnect = () => {
        this._unisatProviderPrivate._isConnected = false;
        this._unisatProviderPrivate._state.isConnected = false;
        this._unisatProviderPrivate._state.accounts = null;
        this._unisatProviderPrivate._selectedAddress = null;
        const disconnectError = ethErrors.provider.disconnected();

        this._emit('accountsChanged', []);
        this._emit('disconnect', disconnectError);
        this._emit('close', disconnectError);
    };

    accountsChanged = (accounts: string[]) => {
        if (accounts?.[0] === this._unisatProviderPrivate._selectedAddress) {
            return;
        }

        this._unisatProviderPrivate._selectedAddress = accounts?.[0];
        this._unisatProviderPrivate._state.accounts = accounts;
        this._emit('accountsChanged', accounts);
    };

    networkChanged = ({ network, chain }) => {
        this.connect({});

        if (network !== this._unisatProviderPrivate._network) {
            if (chain) Web3API.setNetwork(chain);

            this._unisatProviderPrivate._network = network;
            this._emit('networkChanged', network);
        }
    };
}

export default PushEventHandlers;
