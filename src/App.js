import React from 'react';
import Rx from 'rxjs/Rx';
import { component } from 'cycle-react/rxjs';

import CountdownView from './CountdownView';

let App = component('App', function(interactions, props) {
  return Rx.Observable.of(
    <div className="App">
      <CountdownView hours={0} minutes={25} seconds={0} />
    </div>
  );
});

export default App;
