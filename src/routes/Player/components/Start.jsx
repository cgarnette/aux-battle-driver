import React, { Component } from 'react';
import { Settings } from './Settings';
import { PlayerList } from './PlayerList';
import { updateSettings } from '../../../util/api/apiHelper';
import { defaultSettings } from '../../../util/constants';


class Start extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSettings: false,
            showPlayerList: false,
            settings: defaultSettings,
            roomcode: this.props.roomcode
        };
    }

    async componentDidMount() {
        // const settings = await getSettings();
        // this.setState({ settings });
    }

    async updateSettings(e, settings){
        e.preventDefault();
        console.log('updating settings', settings);
        await updateSettings(this.state.roomcode, settings);
        this.setState({ showSettings: false, showPlayerList: true, settings });
    }

    showSettings() {
        this.setState({ showSettings: true, showPlayerList: false });
    }

    backToMain () {
        this.setState({ showSettings: false, showPlayerList: false });
    }

    selectPlayers() {
        this.setState({ showSettings: false, showPlayerList: true });
    }

    getScreen() {
        const { showSettings, settings, showPlayerList } = this.state;
        if (showSettings) {
            return <Settings updateSettings={(e, settings) => this.updateSettings(e, settings)} settings={settings} cancel={() => this.backToMain()}/>
        } else if (showPlayerList) {
            return <PlayerList players={this.props.players} numDJs={settings.numDJs} start={this.props.start} back={() => this.backToMain()}/>
        } else {
            return this.startScreen();
        }
    }

    startScreen() {
        return (
            <div>
                <h1 style={{ color: 'white', textAlign: 'center', marginTop: '1em' }}> You Are The Host </h1>
                <div className="start-screen">
                    <h3 onClick={() => this.showSettings()}>Configure Match</h3>
                    <h3 onClick={() => this.selectPlayers()}>Select Contestants</h3>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="start-screen-container">
                {this.getScreen()}
            </div>
        );
    }
}

export default Start;