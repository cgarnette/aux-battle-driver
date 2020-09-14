import React from 'react';
import { SPOTIFY_LOGIN_URL, AUX_BATTLE_BACKGROUND, PARTY_BACKGROUND } from '../../../util/constants';
import auxBattleLogo from './logo.png';

export const Intro = (props) => {
    const spotify_login = SPOTIFY_LOGIN_URL + (props.redirectURI ? `?redirectURI=${props.redirectURI}` : "");
    const Background = props.title === "Aux Battle" ? AUX_BATTLE_BACKGROUND : PARTY_BACKGROUND;

    return (
        <div>
            <div className="background" style={Background}/>
            <div className="intro-screen">
                <div className="title">
                    <img className="title-screen-logo" height={'350em'} width={'70%'} style={{}} src={auxBattleLogo}/>
                </div>
                <div className="start-btn-container">
                    { auxBattleStartButtons( { ...props, spotify_login } ) }
                </div>
            </div>
        </div>
    );
}

const auxBattleStartButtons = (props) => {
    if (!!props.startBattle) {
        return (
            <div className="start-btn-inner-container">
                <div className="start-btn"><a className="login-btn-link" onClick={() => props.startBattle()}><h3>Start</h3></a></div>
            </div>
        );
    }

    return <div className="login-btn"><a className="login-btn-link" href={props.spotify_login}><h3>Login</h3></a></div>
};