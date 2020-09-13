import React, {Component} from 'react';
import {Button, Icon} from 'semantic-ui-react';
import '../styles/vote.css';
import {getDJs, castVote} from '../../../util/api/apiHelper';
import * as _ from 'lodash';


export class Vote extends Component {

    /**
     * keepers:
     *  { 
     *      id,
     *      albumArt,
     *      username,
     *      trackTitle
     *  }
     * 
     */

    constructor(props){
        super(props);

        this.state = {
            djs: [],
            category: this.props.category,
            roomCode: this.props.roomCode,
            selectedOption: {}
        };
    }

    componentDidMount(){
        if (this.state.djs.length < 1) {
            this.getDJs(this.state.roomCode);
        }
    }

    async getDJs(){
        const djs = await getDJs(this.state.roomCode);
        this.setState({...djs})
    }

    setSelected(dj){
        if (this.state.selectedOption.id === dj.id) {
            this.setState({selectedOption: {}});
        } else {
            this.setState({selectedOption: dj});
        }
    }

    async castVote(){
        const result = await castVote(this.state.roomCode, this.state.selectedOption);
        if(result.success) {
            this.props.finishVoting();
        }
    }

    displayVotingOptions(){

        const options = this.state.djs.map(dj => {
            const className = this.state.selectedOption.id === dj.id ? "voting-option-item-container-selected" : "voting-option-item-container";
            return (
                <li>
                    <div className={className} onClick={() => this.setSelected(dj)}>
                        <h3 className="option-keeper-username">{dj.username}</h3>
                        <div className="album-art"> 
                            <img src={dj.albumArt} height={"150"}/>
                        </div>
                        <h3 className="option-trackTitle">{dj.trackTitle}</h3>
                    </div>
                </li>
            );
        });

        return (
            <div className="voting-options-list-container">
                <ul className="voting-options-list">
                    {options}
                </ul>
            </div>
        );
    }

    render(){
        return (
            <div className="vote-container">
                <div className="vote-container-header">
                    <h1 className="voting-round-category">{this.state.category}</h1>
                    <div className="vote-button-container">
                        <Button onClick={() => this.castVote()} disabled={_.isEmpty(this.state.selectedOption)}>Cast Vote</Button>
                    </div>
                    <hr className="divider"/>
                </div>
                
                {this.state.djs.length > 0 && this.displayVotingOptions()}
                {this.state.djs.length < 1 && <span>Loading <Icon name="spinner" loading size="small"/></span>}
            </div>
        );
    }
}