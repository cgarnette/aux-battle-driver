import React, {Component} from 'react';
import '../styles/playerlist.css';

export class PlayerList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            players: this.props.players || [{username: "Tony", id: "33245232"}, {username: "Amanda", id: "3245234"}, {username: "Sarah", id: "325223532"}, {username: "Tony", id: "33245232"}, {username: "Amanda", id: "3245234"}, {username: "Sarah", id: "325223532"}],
            selected: [],
            numContestants: this.props.numContestants || 6
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props.players !== this.state.players) {
    //         this.setState({players: this.props.players});
    //     }
    // }

    setSelected(e, i){
        e.preventDefault();

        const selected = this.state.selected;
        const foundIndex = this.isSelected(this.state.players[i]);
        if (foundIndex !== -1) {
            selected.splice(foundIndex, 1);
        } else if (selected.length < this.state.numContestants){
            selected.push(this.state.players[i]);
        }

        this.setState({selected});
    }

    isSelected(player){
        const foundIndex = this.state.selected.findIndex(_player => _player.id === player.id);
        return foundIndex;
    }

    displayPlayers(){
        const players = this.state.players.map((player, i) => {
            const className = this.isSelected(player) !== -1 ? "--category-list-item-container-selected": "--category-list-item-container";
            return (
                <li className={className} onClick={(e) => this.setSelected(e, i)}>
                    <div className="--player-list-item">
                        <div className="player-avatar"/>
                        <div style={{ display: "flex", justifyContent: 'center', flexDirection: 'column', width: '80%' }}>
                            <span className="player-name">{player.username}</span>
                        </div>
                    </div>
                    <hr/>
                </li>
            ); 
        });

        return (
            <div>
                <ul className="--player-list">
                        {players}
                </ul>
            </div>
        );
    }

    getDisplayAvi(index) {
        const player = this.state.selected[index];
        if (player) {
            if (player.username.length > 4) {
                return player.username.substring(0, 4).toUpperCase();
            }
            return player.username.toUpperCase();
        }
    }

    twoPlayer() {
        return (
            <div className="--players-settings-btn-container">

                <div className="--start-btn-container">
                    <div className="container">
                        <span className="competitor-img-label">{this.getDisplayAvi(0)}</span>
                    </div>
                </div>

                <h4 className="vs-label">VS</h4>

                <div className="--start-btn-container">
                    <div className="container">
                        <span className="competitor-img-label">{this.getDisplayAvi(1)}</span>
                    </div>
                </div>

            </div>
        );
    }

    multiPlayer() {
        const numContestants = this.state.numContestants;

        const size = 9;
        const style = { height: `${size - numContestants}em`, width: `${size - numContestants}em` };
        const fontSize = 2 - ((numContestants - 2) * .5);
        
        const playerDisplay = Array();
        
        for (let i = 0; i < numContestants; i ++) {
            playerDisplay.push(
                <div className="--start-btn-container" style={style}>
                    <div className="container" style={fontSize}>
                        <span className="competitor-img-label">{this.getDisplayAvi(i)}</span>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <h2 className="vs-label-multiplayer">VS</h2>
                <div className="--players-settings-btn-container">
                    {playerDisplay}
                </div>
            </div>
        );
        
    }

    render(){
        const startDisabled = this.state.selected.length < 2;
        const myStyle = startDisabled ? {color: 'lightgrey'} : {};

        return (
            <div>
                <div className="--players-list-container">
                    
                    {this.state.numContestants === 2 && this.twoPlayer()}
                    {this.state.numContestants > 2 && this.multiPlayer()}
                    <hr/>
                    <div className="--player-select-instruction">
                        Select Competitors
                    </div>
                    <div className="--players-list-display-container">
                        {this.displayPlayers()}
                    </div>
                </div>
                <div className="nav-buttons">
                    <div className="nav-btn" onClick={() => this.props.back()}>
                        <span className="nav-btn-text"> Back </span>
                    </div>
                    <div className="nav-btn">
                        <span className="nav-btn-text"> Start </span>
                    </div>
                </div>
            </div>
        );
    }

}