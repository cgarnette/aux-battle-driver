import {AUX_BATTLE_SERVER} from '../constants';

export const startGame = (tempCode, updateState, redirectURL, gameType="battle") => {

    const path = redirectURL ? `${AUX_BATTLE_SERVER}/spotify/callback?code=${tempCode}&redirectURI=${redirectURL}` : `${AUX_BATTLE_SERVER}/spotify/callback?code=${tempCode}`;

    fetch(path, {method: 'GET'}).then(res => 
    res.json().then(response => {
      const access = response.access_token;
      const refresh = response.refresh_token;

      let startPath = gameType === "battle" ? "start" : "start/party";
      
      if (gameType === 'battle') {
        startPath = 'start';
      } else if (gameType === 'freeforall') {
        startPath = 'start/freeforall';
      } else {
        startPath = 'start/party';
      }
      
      fetch(`${AUX_BATTLE_SERVER}/${startPath}?access_token=${access}&refresh_token=${refresh}`, {method: 'GET'}).then(res_ =>
      res_.json().then(response_ => {
        updateState({token: access, ...response_}, undefined, true);
      }))
    })).catch(error => console.log("error starting the game"));
  };