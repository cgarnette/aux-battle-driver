import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './src/Monitor/App';
import Monitor from './src/Monitor/components/Monitor';
import MainDisplay from './src/Player/components/MainDisplay';
import * as serviceWorker from './src/serviceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const AuxBattle = () => {
    return (
        <Router>
            <Route path="/game" component={Monitor}/>
            {/* <Monitor /> */}
            <Route path="/join" component={MainDisplay}/>
        </Router>
    );
};
ReactDOM.render(<AuxBattle />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
