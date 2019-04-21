
import io from 'socket.io-client';
import {AUX_BATTLE_SERVER} from '../../util/constants';

export class GameController {
    constructor(callback, gameCode){

        this.roundChangeCallback = callback;
        this.initializeSockets();
        this.gameCode = gameCode;
    }


    initializeSockets(){
        this.socket = io(AUX_BATTLE_SERVER);

        this.socket.on('connect', () => {
            this.roundChangeCallback("connected", true);
            this.addToServerRegistry();
        });

        this.socket.on('update', (data) => {
            this.roundChangeCallback(data.property, data.value);
        });

        this.socket.on('token', (data) => {
            this.roundChangeCallback("token", data.token);
        });

        this.socket.on('disconnect', (data) => {
            console.log("i have disconnected.");
            window.location.reload();
        });
    }

    getNextTrack(){
        this.socket.emit('get next', {gameCode: this.gameCode});
    }

    addToServerRegistry(){
        this.socket.emit('add', {gameCode: this.gameCode});
    }
}