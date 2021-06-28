import './App.css';
import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Homepage from './Pages/Homepage.js';
import Metadata from './Pages/Metadata.js';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/metadata" component={Metadata}/>
          <Route exexact path="/" component={Homepage}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;