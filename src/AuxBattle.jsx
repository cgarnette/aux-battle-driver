import React, {Component} from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import { Monitor, Player, PartyRoom, HomePage } from './routes';
import { Provider } from 'react-redux';
import { getStore } from './store/initStore';

import background from './util/crowd.png';
import backdrop from './util/backdrop_2.jpg';


export default class AuxBattle extends Component {

    render(){
        return (
            <Provider store={getStore()}>
                {/* <img height={'75%'} width={'100%'} src={backdrop} style={{position: 'absolute', bottom: 0}}/> */}
                <div className="AuxBattle Container" style={{overflow: "hidden"}}>
                    <Switch>
                        <Route path="/game" component={Monitor}/>
                        <Route path="/join" component={Player}/>
                        <Route path="/party" component={PartyRoom}/>
                        <Route exact path="/" component={HomePage}/>
                    </Switch>
                </div>
            </Provider>
        );
        
    }
}