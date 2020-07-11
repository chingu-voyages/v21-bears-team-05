import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Cupboard from './pages/Cupboard';
import Recipes from './pages/Recipes';

export const AuthContext = React.createContext();
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};
const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <Router>
        <Switch>
          <Route path='/main'>
            <Main />
          </Route>
          <Route path='/profile'>
            <Profile />
          </Route>
          <Route path='/cupboard'>
            <Cupboard />
          </Route>
          <Route path='/recipes'>
            <Recipes />
          </Route>
          <Route path='/'>
            <Landing />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
