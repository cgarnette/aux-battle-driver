import React, {Component} from 'react';
import { Intro } from '../phases/Intro';
import { Join } from '../phases/Join';
import { MessageDisplay, CategoryDisplay } from '../infoDisplay/infoDisplay';
import { Round } from '../phases/Round';
import '../styles/monitor.css';

import {Route, withRouter} from 'react-router-dom';
import {GameController} from '../phases/GameController';

import {playTrackFromURI} from '../../../util/api/spotifyHelper';

import {startGame} from '../../../util/api/services';

class Monitor extends Component {
    constructor(props) {
        super(props);

        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        this.updateCallback.bind(this);
        this.playing = false;

        this.state = {
            loggedIn: false,
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
            players: []
        };
    }

    componentDidUpdate(prevProps, prevState){
      const updateCallback = (property, value, override) => this.updateCallback(property, value, override);
      if (!this.controller && this.state.roomCode) {
        this.controller = new GameController(updateCallback, this.state.roomCode);
      }
    }

    updateCallback(property, value, override=false){
      // console.log("property", property, override);
      if (override) {
        this.setState({...property});
      } else if (property && value) {
        this.setState({[property]: value});
      }
    }

    checkForPlayer() {
        const { token } = this.state;
        if (window.Spotify !== null) {
          if (token) {
              this.initPlayer(token);
              clearInterval(this.playerCheckInterval);
            this.createEventHandlers();
          }  
        }
      }

    initPlayer = (token) => {
        this.player = new window.Spotify.Player({
            name: "Aux Battle",
            getOAuthToken: cb => { cb(token); },
          });
        this.player.connect();
        this.setState({loggedIn: true});
    }

    createEventHandlers() {
        this.player.on('initialization_error', e => { console.error(e); });
        this.player.on('authentication_error', e => {
          console.error(e);
          this.setState({ loggedIn: false });
        });
        this.player.on('account_error', e => { console.error(e); });
        this.player.on('playback_error', e => { console.error(e); });
      
        // Playback status updates
        this.player.on('player_state_changed', state => { 

          if(state && state.track_window.current_track) {
            const currentTrack = {
              duration: state.duration,
              position: state.position,
              artist: state.track_window.current_track.artists[0].name,
              album: state.track_window.current_track.album.name,
              albumArt: state.track_window.current_track.album.images[0].url,
              track: state.track_window.current_track.name,
            };
            this.setState({currentTrack});
          }
        });
      
        // Ready
        this.player.on('ready', data => {
          let { device_id } = data;
          console.log("Let the music play on!");
          this.setState({ deviceId: device_id });
        });

        this.updateInterval = setInterval(() => this.setCurrentTrack(), 1000);
      }

      setCurrentTrack = () => {
        if (this.player) {
          this.player.getCurrentState().then(state => {
            if (state) {
              const currentTrack = {
                duration: state.duration,
                position: state.position,
                artist: state.track_window.current_track.artists[0].name,
                album: state.track_window.current_track.album.name,
                albumArt: state.track_window.current_track.album.images[0].url,
                track: state.track_window.current_track.name,
              };
              this.setState({currentTrack, trackURI: ""});
            }
          });
        }
      };

    callback = ({location}) => {
      const code = location.search.split('?code=')[1];
      this.setState({tempCode: code});
      this.props.history.push('/game')
      return null;
    };

    viewNav = () => {
      if(this.state.currentTrack && this.playing){
        if ( (this.state.currentTrack.position/this.state.currentTrack.duration) * 100 > 99.3) {
          this.controller.songFinished();
          this.playing = false;
        } 
      }

      const updateCallback = (property, value, override) => this.updateCallback(property, value, override);
      const start = this.state.tempCode ? () => startGame(this.state.tempCode, updateCallback) : undefined;

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
          if (!this.playing && this.state.trackURI && this.player && this.state.deviceId) {
            playTrackFromURI(this.state.trackURI, this.state.token, this.player._options.id);
            this.playing = true;
          }
          return this.state.currentTrack && <Round currentBattler={this.state.currentBattler} category={this.state.category} {...this.state.currentTrack} roundNum={this.state.roundNum} round="play"/>
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
        return (
            <div className="monitor-master">
                {this.viewNav()}
                <Route path="/game/callback" component={this.callback} />
            </div>
        );
    }
}

export default withRouter(Monitor);