import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';
import '../styles/join.css';
import logo from '../../Monitor/phases/logo.png';


export class Join extends Component {

    constructor(props) {
        super(props);

        console.log("join constructor");
        this.state = {
            username: "",
            roomcode: ""
        };
    }

    onChange(e, property){
        this.setState({[property]: e.target.value});
    }

    render(){

        console.log("join render");

        const {username, roomcode} = this.state;
        return (
            <div className="join-container">
                <div className="logo-container">
                    <img className="logo-display" src={logo}/>
                </div>
                <div className="join-username-title">
                    <h3>Username</h3>
                </div>
                <div className="join-username-container">
                    <input className="input-username" type="text" value={username} onChange={(e) => this.onChange(e, "username")}/>
                </div>

                <div className="join-roomcode-title">
                    <h3>Room Code</h3>
                </div>
                <div className="join-roomcode-container">
                    <div className="join-roomcode-border">
                        <input className="input-roomcode" type="text" value={roomcode} onChange={(e) => this.onChange(e, "roomcode")}/>
                    </div>
                </div>

                <div className="join-btn-container">
                    <div className="join-btn"><a className="join-btn-link" onClick={(e) => this.props.onClick(e, this.state)}><h3>Join</h3></a></div>
                </div>
            </div>
        );
    }

    
};