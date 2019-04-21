import React from 'react';
import { Icon } from 'semantic-ui-react';
import Background from '../../../backgrounds/background_01_vert.png';
import { AUX_BATTLE_BACKGROUND, PARTY_BACKGROUND } from '../../../util/constants';

export const MessageDisplay = ({ message, gameType }) => {

    let Background;

    if( gameType === "Aux Battle") {
        Background = AUX_BATTLE_BACKGROUND;
    } else if( gameType === "Party") {
        Background = PARTY_BACKGROUND;
    }

    return (
        <div>
            <div className="background" style={Background}/>
            <div className="message-screen">
                <div className="message-display">
                    {message}
                </div>

                <div className="message-loading-spin">
                    <Icon name="spinner" loading size="huge"/>
                </div>
            </div>
        </div>
    );
};

export const CategoryDisplay = ({category}) => {
    const Background = AUX_BATTLE_BACKGROUND;
    return (
        <div>
            <div className="background" style={Background}/>
            <div className="message-screen">
                <div className="category-display">
                    {category}
                </div>

                <div className="category-message">
                    Battlers, prepare your selections!
                </div>

                <div className="message-loading-spin">
                    <Icon name="spinner" loading size="huge"/>
                </div>
            </div>
        </div>
    );
};