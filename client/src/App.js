import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Cupboard from "./pages/Cupboard";
import Recipes from "./pages/Recipes";
import ViewRecipe from "./pages/ViewRecipe";
import PublishRecipe from "./pages/PublishRecipe";
import AuthReducer from "./reducer/AuthReducer";
import AuthContext from "./hooks/AuthContext";

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
          <Route path="/main">
            <Main />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/cupboard">
            <Cupboard />
          </Route>
          <Route path="/recipes/:id" component={ViewRecipe} />
          <Route path="/recipes">
            <Recipes />
          </Route>
          <Route path="/publishrecipe">
            <PublishRecipe />
          </Route>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
