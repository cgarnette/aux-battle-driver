import io from 'socket.io-client';
import {AUX_BATTLE_SERVER} from '../../../util/constants';

class GameController {
    constructor(callback, gameCode){

        this.roundChangeCallback = callback;

        this.initializeSockets();
        this.gameCode = gameCode;


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
            this.roundChangeCallback("connected", true);
            this.socket.emit('init', {gameCode: this.gameCode} )
        });

        this.socket.on('phase', (data) => {
            console.log("state change", data);
            if (data.info) {
                this.roundChangeCallback({phase: data.phase, ...data.info}, undefined, true);
            } else {
                this.roundChangeCallback("phase", data.phase);
            }
        });

        this.socket.on('token', (data) => {
            this.roundChangeCallback("token", data.token);
        });

        this.socket.on('player joined', (data) => {
            this.roundChangeCallback({players: data.players}, undefined, true);
        });

        this.socket.on('disconnect', (data) => {
            console.log("i have disconnected.");
            window.location.reload();
        });

        this.socket.on('game exit', (data) => {
            window.location.reload();
        });

        // this.socket.on('token', (data) => {
        //     this.roundChangeCallback("token", data.token);
        // });
    }

    songFinished(){
        console.log('calling for next');
        this.socket.emit('song-complete', {gameCode: this.gameCode});
    }
}

export default GameController;