import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Cupboard from './pages/Cupboard';
import Recipes from './pages/Recipes';
import ViewRecipe from './pages/ViewRecipe';
import PublishRecipe from './pages/PublishRecipe';

import AuthReducer from './reducer/AuthReducer';
import AuthContext from './hooks/AuthContext';

// Routes
import PrivateRoute from './routes/PrivateRoute';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const App = () => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState);
  return (
    <Router>
      <AuthContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        <Switch>
          <PrivateRoute path='/main'>
            <Main />
          </PrivateRoute>
          <PrivateRoute path='/profile'>
            <Profile />
          </PrivateRoute>
          <PrivateRoute path='/cupboard'>
            <Cupboard />
          </PrivateRoute>
          <PrivateRoute path='/recipes/:id' component={ViewRecipe} />
          <PrivateRoute path='/recipes'>
            <Recipes />
          </PrivateRoute>
          <PrivateRoute path='/publishrecipe'>
            <PublishRecipe />
          </PrivateRoute>
          <Route path='/'>
            <Landing />
          </Route>
        </Switch>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
