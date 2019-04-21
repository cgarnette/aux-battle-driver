import React from 'react';
import { SPOTIFY_LOGIN_URL, AUX_BATTLE_BACKGROUND, PARTY_BACKGROUND } from '../../../util/constants';

export const Intro = (props) => {
    const spotify_login = SPOTIFY_LOGIN_URL + (props.redirectURI ? `?redirectURI=${props.redirectURI}` : "");
    const Background = props.title === "Aux Battle" ? AUX_BATTLE_BACKGROUND : PARTY_BACKGROUND;
    return (
        <div>
            <div className="background" style={Background}/>
            <div className="intro-screen">
                <div className="title">
                    {props.title || "Aux Battle"}
                </div>
                <div className="start-btn-container">
                    {props.start ? (props.title === "Aux Battle" ? auxBattleStartButtons(props.start) : partyRoomStartButtons(props.start) ) : 
                     <div className="login-btn"><a className="login-btn-link" href={spotify_login}><h3>Login</h3></a></div>}
                </div>
            </div>
        </div>
    );
}

const auxBattleStartButtons = (start) => {
    return (
        <div className="start-btn-inner-container">
            <div className="start-btn"><a className="login-btn-link" onClick={() => start()}><h3>Head-to-Head</h3></a></div>
            <div className="start-btn"><a className="login-btn-link" ><h3>Free for All</h3></a></div>
        </div>
    );
};

const partyRoomStartButtons = (start) => {
    return (
        <div className="start-btn-inner-container">
            <div className="start-btn"><a className="login-btn-link" onClick={() => start()}><h3>Start</h3></a></div>
        </div>
    );
};