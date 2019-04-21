import React from 'react';
import { AUX_BATTLE_BACKGROUND } from '../../../util/constants';

export const Join = ({ roomCode, players }) => {

    const _players = players.map((player, i) => {
        return (
            <li className="category-list-item-container">
                <div className="player-list-item">
                    <h3>{player.username}</h3>
                </div>
            </li>
        ); 
    });


    return (
        <div>
            <div className="background" style={AUX_BATTLE_BACKGROUND}/>
            <div className="join-game-player-list-container">
                <div className="room-code-display-container">
                    <div className="title">
                        Room Code
                    </div>
                    <div className="room-code-container">
                        <div className="room-code-display">
                            <span className="room-code">{roomCode || "01A5"}</span>
                        </div> 
                    </div>

                    <div className="waiting-room">
                        Waiting For Players to Join...
                    </div>
                </div>

                <div className="vertical-separator"/>
                <div className="player-list">

                    <div className="players-list-title">Players</div>
                    <div className="players-list-display-container">
                        <div>
                            <ul className="player-list-list">
                                {_players}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};