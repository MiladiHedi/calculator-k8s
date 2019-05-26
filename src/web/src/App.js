import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Factorial from './Factorial';
import Power from './Power';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to Calculator</h1>
            <Link to="/"> Factorial </Link>
            <Link to="/Power"> Power </Link>
          </header>
          <div>
            <Route exact path="/" component={Factorial} />
            <Route path="/Power" component={Power} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
