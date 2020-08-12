import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import 'antd/dist/antd.css';
import './App.styl';
import Login from './components/Login'
import Layout from './components/Layout'
import NoMatch from './components/NoMatch'
class App extends React.Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/" component={Layout} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    )
  }
}

export default App;
