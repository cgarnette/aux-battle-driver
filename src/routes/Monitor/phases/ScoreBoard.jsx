import React, { Component } from 'react';


export default class ScoreBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scoreboard: this.props.scoreboard
        }
    }

    generateScoreBoard = () => {
        const boardList = this.state.scoreboard.map(player => {
            return (
                <li className="score-board-element-line">
                    <div className="score-board-element-container">
                        <h3 className="score-board-element-name">{player.name}</h3>
                        <h3 className="score-board-element-score">{player.score}</h3>
                    </div>
                </li>
            );
        });

        return (
            <div className="board-list-container">
                <ul className="board-list">
                    {boardList}
                </ul>
            </div>
        );
    };

    render(){
        return (
            <div className="score-board-page-container">
                <div className="score-board-header">
                    <h2>Score Board</h2>
                </div>

                <hr className="lineSeparator"/>

                <div className="score-board-container">
                    <div className="score-board">
                        {this.generateScoreBoard()}
                    </div>
                </div>
            </div>
        );
    }
}