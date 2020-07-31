import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Cupboard from "./pages/Cupboard";
import Recipes from "./pages/Recipes";
import ViewRecipe from "./pages/ViewRecipe";
import PublishRecipe from "./pages/PublishRecipe";
import Status from "./components/Status";
import AuthReducer from "./reducer/AuthReducer";
import AuthContext from "./hooks/AuthContext";
import { status } from "./services/subscribers";
import LoginModal from "./components/LoginModal";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const App = () => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState);
  const [statusData, setStatusData] = useState();

  useEffect(() => {
    status.subscribe(setStatusData);
    return () => {
      status.unsubscribe();
    };
  }, []);

  //  When user close login modal
  //  it will clean the status so modal disapear
  const closeLoginModal = () => {
    status.clear();
  };
  return (
    <Router>
      <Status {...{ ...statusData }} />
      <AuthContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        {statusData?.error == "Unauthorized, please login" ? (
          <LoginModal toggle={closeLoginModal} />
        ) : (
          ""
        )}
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
