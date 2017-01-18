//noinspection JSUnresolvedVariable
import 'antd/dist/antd.css';

import React, {} from 'react';
import Rx from 'rx';
import Cycle from 'cycle-react';

import CountdownView from './CountdownView';

//noinspection JSUnresolvedFunction
let App = Cycle.component('App', function (interactions, props) {
    return Rx.Observable.return(
        <div className="App">
            <CountdownView hours={0} minutes={25} seconds={0}/>
        </div>
    );
});

export default App;
