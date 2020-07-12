import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Cupboard from "./pages/Cupboard";
import Recipes from "./pages/Recipes";
import ViewRecipe from "./pages/ViewRecipe";

const App = () => {
  return (
    <Router>
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
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
