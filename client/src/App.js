import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Landing from './pages/Landing'
import Main from './pages/Main'
import Cupboard from './pages/Cupboard'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/main">
          <Main />
        </Route>
        <Route path="/cupboard">
          <Cupboard />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
