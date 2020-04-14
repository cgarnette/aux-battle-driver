export const GAME_STARTED = "Aux Battle Commencing";

const image = require('./crowd.png');
// export const AUX_BATTLE_BACKGROUND = {backgroundImage: "linear-gradient(to right bottom, skyblue, rgb(0, 100, 195))"};
export const AUX_BATTLE_BACKGROUND = {backgroundImage: image};
export const PARTY_BACKGROUND = {backgroundImage: "linear-gradient(to right bottom, rgb(255, 213, 125), rgb(158, 0, 158))"};


export const SPOTIFY_LOGIN_URL = "http://localhost/spotify_login";
export const AUX_BATTLE_SERVER = "http://localhost";

// export const SPOTIFY_LOGIN_URL = "https://dq6qwqode549m.cloudfront.net/spotify_login";
// export const AUX_BATTLE_SERVER = 'https://dq6qwqode549m.cloudfront.net';

export const defaultSettings = {
    playDuration: .2,
    compNum: 2,
    timeToSelect: 60, 
    timeToVote: 15, 
    numRounds: 3, 
    timedSelection: true, 
    timedVoting: true,
    categorySelector: 'host', // either host or judges
    categories: [
        'Prom Night',
        'Last Dance', 
        'Childhood Guilty Pleasure'
    ]
};