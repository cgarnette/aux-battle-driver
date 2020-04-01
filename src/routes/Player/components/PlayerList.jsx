import React, {Component} from 'react';
import '../styles/playerlist.css';

export class PlayerList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            players: this.props.players || [{username: "Tony", id: "33245232"}, {username: "Amanda", id: "3245234"}, {username: "Sarah", id: "325223532"}],
            selected: []
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
        } else if (selected.length < 2){
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
            const className = this.isSelected(player) !== -1 ? "--player-list-item-selected" : "--player-list-item";
            return (
                <li className="category-list-item-container">
                    <div className={className} onClick={(e) => this.setSelected(e, i)}>
                        <h3>{player.username}</h3>
                    </div>
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

    render(){
        const startDisabled = this.state.selected.length < 2;
        const myStyle = startDisabled ? {color: 'lightgrey'} : {};

        return (
            <div className="--players-list-container">
                
                <div className="--players-settings-btn-container">
                    <div className="--start-btn-container">
                        <div className="--start-btn" disabled={startDisabled} style={myStyle} onClick={(e) => this.props.start(e, this.state.selected)}>
                            <h3 className="--start-title">Start</h3>
                        </div>
                    </div>
                    <h4>Host</h4>
                    <div className="--settings-btn-container">
                        <div className="--players-settings-btn" onClick={() => this.props.showSettings()}>
                            <h3 className="--settings-btn-title">Settings</h3>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="--player-select-instruction">
                    Select 2 Players to hold the Aux
                </div>
                <div className="--players-list-display-container">
                    {this.displayPlayers()}
                </div>
            </div>
        );
    }

}