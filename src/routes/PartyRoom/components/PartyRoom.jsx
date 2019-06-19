import React, {Component} from 'react';

import {Route, withRouter} from 'react-router-dom';
import GameController from '../GameController';

import { Intro } from '../../Monitor/phases/Intro';
import { MessageDisplay} from '../../Monitor/infoDisplay/infoDisplay';
import { Round } from '../../Monitor/phases/Round';

import {playTrackFromURI} from '../../../util/api/spotifyHelper';

import {startGame} from '../../../util/api/services';

import * as _ from 'lodash';
import './styles.css';

class PartyRoom extends Component {
    constructor(props) {
        super(props);

        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        this.updateCallback.bind(this);
        this.playing = false;
        this.waitingForNext = true;

        this.state = {
            loggedIn: false,
            token: undefined,
            roomCode: undefined,
            phase: "start",
            connected: false,
            trackURI: "",
            trackCounter: 0
        };
    }

    componentDidUpdate(prevProps, prevState){
      if (!this.controller && this.state.roomCode) {
        console.log("roomCode", this.state.roomCode);
        this.controller = new GameController((property, value, override) => this.updateCallback(property, value, override), this.state.roomCode );
        this.controller.addToServerRegistry();
      }

      if (!_.isEmpty(this.state.nextToPlay) && _.isEmpty(this.state.trackURI)) {
        this.setState({trackURI: this.state.nextToPlay, nextToPlay: undefined});
        this.readyNext = true;
      }

      if (this.readyNext) {
        this.readyNext = false;
        console.log("updating next", _.cloneDeep(this.state));
        this.controller.getNextTrack();
      }

      if (this.state.phase === "round-play") {
        if (!this.playing && this.state.trackURI && this.player && this.state.deviceId) {
          playTrackFromURI(this.state.trackURI, this.state.token, this.player._options.id);
          this.playing = true;
        } else if (!this.playing && this.state.deviceId && _.isEmpty(this.state.trackURI) && !this.state.currentTrack && this.waitingForNext) {
          this.waitingForNext = false;
          console.log("getting next track");
          this.controller.getNextTrack();
        }
      }

      if(this.state.currentTrack && this.playing){
        if ( (this.state.currentTrack.position/this.state.currentTrack.duration) * 100 > 99.3) {
            this.playing = false;
            this.setState({trackURI: undefined, currentTrack: undefined, trackCounter: this.state.trackCounter++});
        } 
      }


    }

    updateCallback(property, value, override=false){
        console.log("property", property, override);
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
            name: "My Party Room",
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
              this.setState({currentTrack});
            }
          });
        }
      };

    callback = ({location}) => {
      const code = location.search.split('?code=')[1];
      this.setState({tempCode: code});
      this.props.history.push('/party');
      return null;
    };


    async startGameRoom(){
        const updateCallback = (property, value, override) => this.updateCallback(property, value, override);
        await startGame(this.state.tempCode, updateCallback, "party/callback", "party");
        this.setState({phase: "round-play"});
    }

    viewNav = () => {
      const start = this.state.tempCode ? () => this.startGameRoom() : undefined;

      switch(this.state.phase) {
        case "start":
          return <Intro start={start} title="My Party Room" redirectURI={"party/callback"}/>
        case "round-play":
          return ( this.state.currentTrack && this.state.trackURI
            ? this.headerWrapper(<Round currentBattler={this.state.currentBattler} category={this.state.category} {...this.state.currentTrack} roundNum={this.state.roundNum} round="play"/>) 
            : this.headerWrapper(<MessageDisplay gameType="Party" message={"Waiting..."}/>) )
        case "wait":
          return <MessageDisplay gameType="Party" message={"Waiting..."}/>
        default:
      }
    };

    headerWrapper(children){

      return (
        <div className="-room-code-header">
          <h2 className="room-code">www.theauxbattle.com/join</h2>
          <h2 className="room-code">Room Code: {this.state.roomCode}</h2>
          {children}
        </div>
      );
    }

    render(){
        return (
            <div>
                {this.viewNav()}
                <Route path="/party/callback" component={this.callback} />
            </div>
        );
    }
}

export default withRouter(PartyRoom);