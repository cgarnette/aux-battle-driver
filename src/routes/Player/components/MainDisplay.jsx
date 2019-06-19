import React, {Component} from 'react';
import {Join} from './Join';
import { Waiting, TrackPlaying, RoundWinner, LockScreen } from '../common/GenericMessages';
import GameController from '../GameController';
import { Settings } from './Settings';
import { PlayerList } from './PlayerList';
import { TrackSearch } from './TrackSearch';
import { Vote } from './Vote';
import './global.css';
import { updateSettings } from '../../../util/api/apiHelper';
import { PARTY_BACKGROUND } from '../../../util/constants';

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
            roomType: "battle"
        };
    }

    updateCallback(property, value, override=false){
        // console.log("property", property, override);
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

    hostDisplayDriver(){
        const {phase, players, categories} = this.state;
        switch(phase){
            case 'join':
                
                return <Join onClick={(e, gameState) => this.joinGame(e, gameState)}/>
            case 'waiting-room':
                if (this.state.showSettings) {
                    return <Settings categories={categories} goBack={() => this.setState({showSettings: false})} updateSettings={(e, settings) => this.updateSettings(e, settings)}/>
                }
                return <PlayerList players={players} start={(e, keepers) => this.startGame(e, keepers)} showSettings={() => this.setState({showSettings: true})}/>
            case 'game start':
            case 'wait':
                return <Waiting message={"Waiting"}/>
            case 'lock':
                return <LockScreen/>
            case 'track-selection':
                return <Waiting message={"Waiting"}/>
            case 'round-play':
                return <TrackPlaying 
                    albumArt={this.state.albumArt}
                    artist={this.state.artist}
                    player={this.state.currentBattler}
                    category={this.state.category}
                    songTitle={this.state.trackTitle}
                    />
            case 'vote':
                if (this.state.voting) {
                    return <Vote category={this.state.category} roomCode={this.state.roomcode} finishVoting={() => this.finishVoting()}/>
                }
                return <Waiting message={"Waiting"}/>
            case 'round-over':
                return <RoundWinner 
                player={this.state.winner}
                category={this.state.category}
                albumArt={this.state.albumArt}
                />
            case 'game-over':
                return <RoundWinner 
                player={this.state.winner}
                category={this.state.category}
                albumArt={this.state.albumArt}
                gameOver={true}
                />
            default:
        }
    }

    hostKeeperDisplayDriver(){
        const {phase, players, categories} = this.state;
        switch(phase){
            case 'join':
                
                return <Join onClick={(e, gameState) => this.joinGame(e, gameState)}/>
            case 'waiting-room':
                if (this.state.showSettings) {
                    return <Settings categories={categories} goBack={() => this.setState({showSettings: false})} updateSettings={(e, settings) => this.updateSettings(e, settings)}/>
                }
                return <PlayerList players={players} start={(e, keepers) => this.startGame(e, keepers)} showSettings={() => this.setState({showSettings: true})}/>
            case 'game start':
            case 'wait':
                return <Waiting message={"Waiting"}/>
            case 'lock':
                return <LockScreen/>
            case 'track-selection':
                if (this.state.showTrackSearch) {
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

    keeperDisplayDriver(){
        switch(this.state.phase){
            case 'join':
                return <Join onClick={(e, gameState) => this.joinGame(e, gameState)}/>
            case 'waiting-room':
            case 'wait':
                return <Waiting message={"Waiting"}/>
            case 'lock':
                return <LockScreen/>
            case 'game start':
                return <Waiting message={"Waiting"}/>
            case 'track-selection':
                if (this.state.showTrackSearch) {
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

    judgeDisplayDriver(){
        switch(this.state.phase){
            case 'join':
                return <Join onClick={(e, gameState) => this.joinGame(e, gameState)}/>
            case 'waiting-room':
            case 'wait':
                return <Waiting message={"Waiting"}/>
            case 'lock':
                return <LockScreen/>
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

    headToHead(){
        return (
            <React.Fragment>
                {(this.state.host && !this.state.keeper) && this.hostDisplayDriver()}
                {(this.state.keeper && !this.state.host) && this.keeperDisplayDriver()}
                {(this.state.keeper && this.state.host) && this.hostKeeperDisplayDriver()}
                {(!this.state.host && !this.state.keeper) && this.judgeDisplayDriver()}
            </React.Fragment>
        );
    }

    freeForAll(){
        return (
            <div/>
        );
    }

    render(){
        console.log('playerState', JSON.stringify(this.state));
        return (
            <div>
                <div className="app-background"  style={PARTY_BACKGROUND}/>
                {!this.state.freeForAll && this.headToHead()}
                {this.state.freeForAll && this.freeForAll()}
            </div>
        );
    }
}

export default MainDisplay;