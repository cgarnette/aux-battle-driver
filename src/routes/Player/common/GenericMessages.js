import {Icon} from 'semantic-ui-react';
import React from 'react';
import '../styles/generics.css';
import lock from '../styles/locked.png';


export const LockScreen = () => (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <img src={lock} style={{height: '20%', width: '20%', marginTop: '15em'}}/>
        </div>
    </div>
);

export const Waiting = ({message}) => {
    return (
        <div className="message-container">
            <div className="message-generic">
                <h2>{message}</h2>
            </div>
            <div className="message-loading-spinner">
                <Icon name="spinner" loading size="big"/>
            </div>
        </div>
    );
}

export const TrackPlaying = ({artist, songTitle, albumArt, player, category}) => {
    return (
        <div>
            <div className="background" style={{backgroundImage: `url(${albumArt})`}}/>
            <div className="--player-container">

                
                <div className="round-category"> <h1>{category}</h1> </div>
                <div className="--player-username"> <h2>{player}</h2> </div>
                <div className="--player-album-art-container">
                    <div className="--player-album-art" style={{backgroundImage: `url(${albumArt})`}}/>
                </div>
                
                <div className="--player-artist"> <h3>{artist}</h3> </div>
                <div className="song-title"><h3>{songTitle}</h3> </div>
            </div>
        </div>
    );
};

export const RoundWinner = ({player, category, albumArt, gameOver}) => {
    return (
        <div>
            <div className="background" style={{backgroundImage: `url(${albumArt})`}}/>
            <div className="--player-container">

                <div className="round-category"> <h1>{category}</h1> </div>
                <div className="round-winner-message"><h2>{gameOver ? "Aux Battle Champion" : "Round Winner"}</h2></div>
                <div className="--player-username"> <h2>{player}</h2> </div>
                <div className="--player-album-art-container">
                    <div className="--player-album-art" style={{backgroundImage: `url(${albumArt})`}}/>
                </div>

            </div>
        </div>
    );
};