import React, {Component} from 'react';
import { Intro } from '../phases/Intro';
import { Join } from '../phases/Join';
import { MessageDisplay, CategoryDisplay } from '../infoDisplay/infoDisplay';
import { Round } from '../phases/Round';
import ScoreBoard from '../phases/ScoreBoard';
import '../styles/monitor.css';

import { Route, withRouter } from 'react-router-dom';
import GameController from '../controllers/GameController';
import PlaybackController from '../controllers/PlaybackController';
import MusicPlayer from '../controllers/MusicPlayer';

import { playTrackFromURI } from '../../../util/api/spotifyHelper';
import { startGame } from '../../../util/api/services';
import { 
  closeJoinPhase, 
  startTrackSelection, 
  startPlaybackRound,
  endVotePhase 
} from '../../../util/api/apiHelper';

import { connect } from 'react-redux';
import * as gameActions from '../../../store/GameStore/gameActions';
import * as playbackActions from '../../../store/PlaybackStore/playbackActions';
import * as _ from 'lodash';

import background from '../../../util/crowd.png';


/**
 * Purpose:
 * Route the application between the various views.
 * 
 * 
 * Sample State:
 * token,
 * roomCode,
 * gameStarted,
 * currentTrack
 * phase,
 * connected,
 * trackURI,
 * roundNum,
 * currentBattler,
 * currentBattlerImg
 * category,
 * tempCode,
 * players,
 * playDuration,
 * timeRemaining,
 * settings: {
 * timedSelection,
 * timeToSelect,
 * timedVoting,
 * timeToVote,
 * timedCats,
 * timeToSubmitCat
 * }
 */

class Monitor extends Component {
    constructor(props) {
        super(props);

        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        this.playing = false;

        this.state = {
            gameStarted: false,
            phase: "start",
            connected: false,
            trackURI: "",
            roundNum: 1,
            players: [],
            playDuration: .2,
            timeRemaining: 30,
            settings: {
              timedSelection: false,
              timeToSelect: 60,
              timedVoting: false,
              timeToVote: 15,
              timedCats: false,
              timeToSubmitCat: 30
            }
        };
    }

    componentDidUpdate(prevProps, prevState){
      if (!this.playbackController) {
        this.playbackController = new PlaybackController(this.state.playDuration);
      }

      if (!this.gameController && this.state.roomCode) {
        this.gameController = new GameController(this.props.updateStore, this.state.roomCode);
      }

      if (this.props.gameState !== prevProps.gameState) {
        this.setState({...this.props.gameState, ...this.props.playbackState});
      }
    }

    setTimer(duration, callback) {
      this.setState({
        timer: setInterval(() => this.timerTick(callback), 1000),
        timeRemaining: duration
      }); 
    }

    timerTick(callback){
      if (!this.showTimer()) {
        this.clearTimer();
        return;
      }
      if (this.state.timeRemaining === 0) {
        callback();
        this.clearTimer();
        return;
      }

      this.setState({
        timeRemaining: this.state.timeRemaining - 1
      });
    }
    
    clearTimer(){
      clearInterval(this.state.timer);
      this.setState({
        timeRemaining: 0,
        timer: undefined
      });
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
      const startBattle = this.state.tempCode ? () => startGame(this.state.tempCode, this.props.updateStore, undefined, 'battle') : undefined;

      console.log("start", startBattle);
      switch(this.state.phase) {
        case "start":
          return <Intro startBattle={startBattle} title="Aux Battle"/>
        case "join":
          return <Join roomCode={this.state.roomCode} players={this.state.players}/>
        case "game start":
          return <MessageDisplay gameType="Aux Battle" message={"Game Has Started!"}/>
        case "track-selection":
          (this.state.settings.timedSelection && !this.state.timer) && this.setTimer(this.state.settings.timeToSelect, () => startPlaybackRound(this.state.roomCode));
          this.playbackController.setPlaybackDuration(this.state.playDuration);
          return <CategoryDisplay category={this.state.category}/>
        case "round-play":
          if (_.isEmpty(this.state.currentTrack) && this.state.trackURI && this.state.deviceId) {
            playTrackFromURI(this.state.trackURI, this.state.token, this.state.playerId);
          }
          return !_.isEmpty(this.state.currentTrack) && <Round currentBattler={this.state.currentBattler} category={this.state.category} {...this.state.currentTrack} playDuration={this.state.playDuration} roundNum={this.state.roundNum} round="play"/>
        case "wait":
          return <MessageDisplay gameType="Aux Battle" message={"Loading..."}/>
        case "vote":
          (this.state.settings.timedVoting && !this.state.timer) && this.setTimer(this.state.settings.timeToVote, () => endVotePhase(this.state.roomCode));
          return <MessageDisplay gameType="Aux Battle" message={"Voting is now open!"}/>
        case "round-over":
          return <Round round="roundWinner" category={this.state.category} preview={this.state.preview} roundNum={this.state.roundNum} albumArt={this.state.albumArt} winner={this.state.winner}/>
        case "game-over":
          return <Round round="gameWinner" category={this.state.category} preview={this.state.preview} roundNum={this.state.roundNum} albumArt={this.state.albumArt} winner={this.state.winner}/>
        case "get ready":
          return <MessageDisplay gameType="Aux Battle" message={"Judges Prepare to Vote"}/>
        case "category-submission":
          this.state.settings.timedCats && this.setTimer(this.state.settings.timeToSubmitCat, () => startTrackSelection(this.state.roomCode))
          return <MessageDisplay gameType="Aux Battle" message={"Category Submission is Open!"}/>
        case "leaderboard":
          return <ScoreBoard scoreboard={this.state.scoreboard}/>
        default:
      }
    };

    headerWrapper(children){
      return (
        <div className="-room-code-header-battle">
          {this.showTimer() && <h2 className="room-code">: {' ' + this.state.timeRemaining}</h2>}
          {this.state.phase !== 'join' && <h2 className="room-code">Room Code: {' ' + this.state.roomCode}</h2>}
          {children}
        </div>
      );
    }

    showTimer(){
      if (this.state.settings.timedVoting && this.state.phase === 'vote') {
        return true;
      }
      else if (this.state.settings.timedSelection && this.state.phase === 'track-selection') {
        return true;
      }
      else if (this.state.settings.timedCats && this.state.phase === 'category-submission') {
        return true;
      }

      return false;
    }

    render(){
        return (
            <div className="monitor-master">
                {!['round-play', 'round-over', 'game-over'].includes(this.state.phase) && 
                  <img height={'75%'} width={'100%'} src={background} style={{position: 'absolute', bottom: 0}}/>
                }
                {this.state.phase !== 'start' 
                  ? this.headerWrapper(this.viewNav())
                  : this.viewNav()
                }
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
  setFreeForAll: gameActions.setFreeForAll,
  setCurrentTrack: playbackActions.setCurrentTrack,
  setDeviceId: playbackActions.setDeviceId,
  setPlayerId: playbackActions.setPlayerId
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Monitor));