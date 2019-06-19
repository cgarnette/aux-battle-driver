import React, {Component} from 'react';
import { Intro } from '../phases/Intro';
import { Join } from '../phases/Join';
import { MessageDisplay, CategoryDisplay } from '../infoDisplay/infoDisplay';
import { Round } from '../phases/Round';
import '../styles/monitor.css';

import { Route, withRouter } from 'react-router-dom';
import GameController from '../controllers/GameController';
import PlaybackController from '../controllers/PlaybackController';
import MusicPlayer from '../controllers/MusicPlayer';

import { playTrackFromURI } from '../../../util/api/spotifyHelper';

import { startGame } from '../../../util/api/services';

import { connect } from 'react-redux';
import * as gameActions from '../../../store/GameStore/gameActions';
import * as playbackActions from '../../../store/PlaybackStore/playbackActions';
import * as _ from 'lodash';

class Monitor extends Component {
    constructor(props) {
        super(props);

        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        this.playing = false;

        console.log('props', this.props);
        console.log('action creators', gameActions);

        this.state = {
            token: undefined,
            roomCode: undefined,
            gameStarted: false,
            currentTrack: undefined,
            phase: "start",
            connected: false,
            trackURI: "",
            roundNum: 1,
            currentBattler: undefined,
            currentBattlerImg: undefined,
            category: undefined,
            players: [],
            playDuration: .2
        };
    }

    componentDidUpdate(prevProps, prevState){
      if (!this.playbackController) {
        this.playbackController = new PlaybackController(this.state.playDuration);
      }

      if (!this.gameController && this.state.roomCode) {
        this.gameController = new GameController(this.props.updateStore, this.state.roomCode);
      }
      console.log("props", _.cloneDeep(this.props));
      if (this.props.gameState !== prevProps.gameState) {
        this.setState({...this.props.gameState, ...this.props.playbackState});
      }
    }

    checkForPlayer() {
        const { token } = this.state;
        if (window.Spotify !== null) {
          if (token) {
            clearInterval(this.playerCheckInterval);

            this.musicPlayer = new MusicPlayer(token, (id) => this.props.setPlayerId(id)); 
            const player = this.musicPlayer.getPlayer();
            this.playbackController.createEventHandlers(player, this.props.setCurrentTrack, this.props.setDeviceId);

            setInterval(() => this.playbackController.getPlayerState(player, this.props.setCurrentTrack, () => this.gameController.songFinished()), 1000);
          }  
        }
      }

    callback = ({location}) => {
      const code = location.search.split('?code=')[1];
      this.setState({tempCode: code});
      this.props.history.push('/game')
      return null;
    };

    viewNav = () => {
      const start = this.state.tempCode ? () => startGame(this.state.tempCode, this.props.updateStore) : undefined;

      switch(this.state.phase) {
        case "start":
          return <Intro start={start} title="Aux Battle"/>
        case "join":
          return <Join roomCode={this.state.roomCode} players={this.state.players}/>
        case "game start":
          return <MessageDisplay gameType="Aux Battle" message={"Game Has Started!"}/>
        case "track-selection":
          return <CategoryDisplay category={this.state.category}/>
        case "round-play":
          if (_.isEmpty(this.state.currentTrack) && this.state.trackURI && this.state.deviceId) {
            console.log("starting playback");
            playTrackFromURI(this.state.trackURI, this.state.token, this.state.playerId);
          }
          return !_.isEmpty(this.state.currentTrack) && <Round currentBattler={this.state.currentBattler} category={this.state.category} {...this.state.currentTrack} playDuration={this.state.playDuration} roundNum={this.state.roundNum} round="play"/>
        case "wait":
          return <MessageDisplay gameType="Aux Battle" message={"Loading..."}/>
        case "vote":
          return <MessageDisplay gameType="Aux Battle" message={"Voting is now open!"}/>
        case "round-over":
          return <Round round="roundWinner" category={this.state.category} preview={this.state.preview} roundNum={this.state.roundNum} albumArt={this.state.albumArt} winner={this.state.winner}/>
        case "game-over":
          return <Round round="gameWinner" category={this.state.category} preview={this.state.preview} roundNum={this.state.roundNum} albumArt={this.state.albumArt} winner={this.state.winner}/>
        case "get ready":
          return <MessageDisplay gameType="Aux Battle" message={"Judges Prepare to Vote"}/>
        default:
      }
    };

    render(){
      console.log('monitor state', _.cloneDeep(this.state));
        return (
            <div className="monitor-master">
                {this.viewNav()}
                <Route path="/game/callback" component={this.callback} />
            </div>
        );
    }
}

const getGameState = (state) => state.gameState;
const getPlaybackState = (state) => state.playbackState;

const mapStateToProps = (state) => {
  return {
    gameState: getGameState(state),
    playbackState: getPlaybackState(state)
  }
};

const mapDispatchToProps = {
  updateStore: gameActions.OverrideStore,
  setCurrentTrack: playbackActions.setCurrentTrack,
  setDeviceId: playbackActions.setDeviceId,
  setPlayerId: playbackActions.setPlayerId
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Monitor));