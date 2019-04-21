import React, {Component} from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import { Monitor, Player, PartyRoom, HomePage } from './routes';

export class AuxBattle extends Component {




    render(){
        return (
            <div className="AuxBattle Container" style={{overflow: "hidden"}}>
                <Switch>
                    <Route path="/game" component={Monitor}/>
                    <Route path="/join" component={Player}/>
                    <Route path="/party" component={PartyRoom}/>
                    <Route exact path="/" component={HomePage}/>
                </Switch>
            </div>
        );
        
    }
}