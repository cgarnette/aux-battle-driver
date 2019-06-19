

class MusicPlayer {

    constructor (token, setPlayerId) {
        this.player = new window.Spotify.Player({
            name: "Aux Battle",
            getOAuthToken: cb => { cb(token); },
          });
        this.player.connect();

        console.log('player Id', this.player._options.id);
        setPlayerId(this.player._options.id);
    }

    getPlayer = () => {
        return this.player;
    }
}

export default MusicPlayer;