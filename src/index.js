import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {AuxBattle} from './AuxBattle';

const FullGame = () => {
    return (
        <Router>
            {/* <Route path="/game" component={Monitor}/>
            <Route path="/join" component={MainDisplay}/> */}
            <AuxBattle/>
        </Router>
    );
};
ReactDOM.render(<FullGame />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
