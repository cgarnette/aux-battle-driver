
class PlaybackController {

  constructor (playbackDuration=1) {
    this.playbackDuration = playbackDuration;
  }

  setPlaybackDuration(duration=1){
    this.playbackDuration = duration;
  }

  createEventHandlers = (player, setCurrentTrack, setDeviceId)  => {
    player.on('initialization_error', e => { console.error(e); });
    player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    player.on('account_error', e => { console.error(e); });
    player.on('playback_error', e => { console.error(e); });
  
    // Playback status updates
    player.on('player_state_changed', state => { 

      console.log('Player state changed', state);
      if(state && state.track_window.current_track && !state.paused) {

        const currentTrack = {
          duration: state.duration,
          position: state.position,
          artist: state.track_window.current_track.artists[0].name,
          album: state.track_window.current_track.album.name,
          albumArt: state.track_window.current_track.album.images[0].url,
          track: state.track_window.current_track.name,
        };

        setCurrentTrack(currentTrack);
      }
    });
  
    // Ready
    player.on('ready', data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      setDeviceId(device_id);
    });

  }

  getPlayerState = (player, setCurrentTrack, finished) => {
    if (player) {
      player.getCurrentState().then(state => {
        if(state && !state.paused) {
          let currentTrack;
          const currentPosition = (state.position/(state.duration * this.playbackDuration)) * 100;
  
          if (currentPosition > 99.3) {
            console.log('current position too large');
            currentTrack = {};
            player.pause().then(() => {
              console.log('ready for next');
              finished();
            });
  
          } else {
            currentTrack = {
              duration: state.duration,
              position: state.position,
              artist: state.track_window.current_track.artists[0].name,
              album: state.track_window.current_track.album.name,
              albumArt: state.track_window.current_track.album.images[0].url,
              track: state.track_window.current_track.name,
            };
          }
          
          setCurrentTrack(currentTrack);
        }
      });
    }
  };
}

export default PlaybackController;

