import io from 'socket.io-client';
import { AUX_BATTLE_SERVER } from '../../util/constants';

class GameController {
    constructor(callback){

        this.roundChangeCallback = callback;

        this.initializeSockets();
        /**
         * init: this is where the monitor signs into spotify
         * join: when players are joining the game using the room code
         * 
         * MAIN FLOW START 
         * 
         * track-selection: after the host has set categories and started the game
         *      the players select there track for the first round. This phase also occurs
         *      after every "round-winner" phase.
         * track-loading: waiting for track information from the server and gives players about 5-10 seconds
         *      to breathe before the track begins
         * round-play: plays the track selected by a player for this round
         * vote: players vote after all battlers have played their track for this round
         * tallying: A waiting screen while votes are being tallied. Adds suspense. 5-10 seconds
         * round-winner: votes are tallied and a winner for this round is declared
         * 
         * MAIN FLOW END
         * 
         * game-winner: exit point of the game.
         */
        const gamePhases = ["init","join", "game start", "track-selection","track-loading","round-play", "wait","vote","round-winner","game-winner"];
    }


    initializeSockets(){
        this.socket = io(AUX_BATTLE_SERVER);

        this.socket.on('connect', () => {
            console.log("connected");
        });

        this.socket.on('phase', (data) => {
            console.log("state change", data);
            if (data.info) {
                this.roundChangeCallback({phase: data.phase, ...data.info}, undefined, true);
            } else {
                this.roundChangeCallback("phase", data.phase);
            }
        });

        this.socket.on('player joined', (data) => {

            const newState = {connected: true, phase: 'waiting-room'};
            if (data.id) {
                newState["id"] = data.id;
            }
            if (data.players) {
                newState["players"] = data.players;
            }

            this.roundChangeCallback({...newState}, undefined, true);
        });

        this.socket.on('set role', (data) => {
            this.roundChangeCallback(data, undefined, true);
        });

        this.socket.on('disconnect', (data) => {
            console.log("i have disconnected.");
            window.location.reload();
        });

        this.socket.on('game exit', (data) => {
            window.location.reload();
        });
    }

    startGame(gameCode, keepers) {
        this.socket.emit('start', {gameCode, keepers});
    }

    join(gameCode, username){
        console.log("joining");
        this.socket.emit('join game', {gameCode, username});
        
    }


    emit(channel, data){
        this.socket.emit(channel, data);
    }
}

export default GameController;