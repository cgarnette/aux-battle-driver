import React, {Component} from 'react';
import {Join} from './Join';
import { Waiting, TrackPlaying, RoundWinner, LockScreen, CategorySubmit } from '../common/GenericMessages';
import GameController from '../GameController';
import { Settings } from './Settings';
import { PlayerList } from './PlayerList';
import { TrackSearch } from './TrackSearch';
import { Vote } from './Vote';
import './global.css';
import { updateSettings, updateUser } from '../../../util/api/apiHelper';
import { PARTY_BACKGROUND } from '../../../util/constants';
import background from '../../../util/crowd.png';
import * as _ from "lodash";

class MainDisplay extends Component {

    constructor(props){
        super(props);

        this.updateCallback.bind(this);
        this.joinGame.bind(this);
        this.updateSettings.bind(this);
        this.startGame.bind(this);
        this.hideTrackSearch.bind(this);
        this.finishVoting.bind(this);

        const updateCallback = (property, value, override) => this.updateCallback(property, value, override);
        this.controller = new GameController(updateCallback);

        this.state = {
            phase: 'join',
            id: undefined,
            connected: false,
            host: false,
            auxKeeper: false,
            players: [],
            showSettings: false,
            categories: [],
            showTrackSearch: true,
            category: "",
            voting: true,
            roomType: "battle",
            roomcode: ''
        };
    }

    componentDidMount(){
        if (_.isEmpty(this.state.roomcode) || !this.state.username) {
            const username = localStorage.getItem('username');
            const roomcode = localStorage.getItem('roomcode');
            if (username && roomcode) {
                const mockE = { preventDefault: () => {} };
                this.joinGame(mockE, { roomcode, username });
            }
        }
    }

    updateCallback(property, value, override=false){
        if (override) {
          this.setState({...property});
        } else if (property && value) {
          this.setState({[property]: value});
        }
      }


    joinGame(e, gameState){
        e.preventDefault();
        const { username, roomcode } = gameState;
        this.controller.join(roomcode, username);

        localStorage.setItem('username', username);
        localStorage.setItem('roomcode', roomcode);

        this.setState({roomcode, username});
    }

    startGame(e, keepers) {
        e.preventDefault();

        const roomcode = this.state.roomcode;
        this.controller.startGame(roomcode, keepers);
    }

    async updateSettings(e, settings){
        e.preventDefault();

        await updateSettings(this.state.roomcode, settings);
        this.setState({showSettings: false, categories: settings.categories});
    }

    hideTrackSearch(){
        this.setState({showTrackSearch: false});
    }

    finishVoting(){
        this.setState({voting: false});
    }

    DisplayDriver(){
        switch(this.state.phase){
            case 'join':
                return <Join onClick={(e, gameState) => this.joinGame(e, gameState)}/>
            case 'lock':
                return <LockScreen/>
            case 'waiting-room':
                if (this.state.host) {
                    if (this.state.showSettings) {
                        return <Settings categories={this.state.categories} playDuration={.2} updateSettings={(e, settings) => this.updateSettings(e, settings)}/>
                    }
                    return <PlayerList players={this.state.players} start={(e, keepers) => this.startGame(e, keepers)} showSettings={() => this.setState({showSettings: true})}/>
                }
                return <Waiting message={"Waiting"}/>

            case 'category-submission':
                return <CategorySubmit roomcode={this.state.roomcode} lock={() => this.setState({phase: 'wait'})}/>
                
            case 'track-selection':
                if (this.state.showTrackSearch && this.startGame.keeper) {
                    return <TrackSearch roomType={this.state.roomType} category={this.state.category} playerId={this.state.id} roomCode={this.state.roomcode} submissionSuccessful={() => this.hideTrackSearch()}/>
                }
                return <Waiting message={"Waiting"}/>
            case 'round-play':
                return <TrackPlaying 
                    albumArt={this.state.albumArt}
                    artist={this.state.artist}
                    player={this.state.currentBattler}
                    category={this.state.category}
                    songTitle={this.state.trackTitle}
                    />
            case 'round-over':
                return <RoundWinner 
                player={this.state.winner}
                category={this.state.category}
                albumArt={this.state.albumArt}
                />
            case 'vote':
                if (this.state.voting) {
                    return <Vote category={this.state.category} roomCode={this.state.roomcode} finishVoting={() => this.finishVoting()}/>
                }
                // return <Waiting message={"Waiting"}/>
            case 'game-over':
                return <RoundWinner 
                player={this.state.winner}
                category={this.state.category}
                albumArt={this.state.albumArt}
                gameOver={true}
                />
            default:
                return <Waiting message={"Waiting"}/>
        }
    }

    render(){
        console.log('playerState', JSON.stringify(this.state));
        updateUser(this.state.roomcode, this.state);
        return (
            <div>
                {/* <div className="app-background"  style={PARTY_BACKGROUND}/> */}
                {!['round-play', 'round-over', 'game-over'].includes(this.state.phase) && 
                  <img height={'55%'} width={'150%'} src={"background"} style={{position: 'absolute', bottom: 0}}/>
                }
                <div className="background"/>
                <PlayerList/>
                {/* <this.DisplayDriver/> */}
            </div>
        );
    }
}

export default MainDisplay;