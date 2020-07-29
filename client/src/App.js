import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Cupboard from "./pages/Cupboard";
import Recipes from "./pages/Recipes";
import ViewRecipe from "./pages/ViewRecipe";
import PublishRecipe from "./pages/PublishRecipe";
import LoginModal from "./components/LoginModal";

import AuthReducer from "./reducer/AuthReducer";
import AuthContext from "./hooks/AuthContext";

import { observerServerAPI } from "./services/serverAPI";

const authState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const App = () => {
  //  State for status code received from localDB Request
  const [serverAPIState, setServerAPIState] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [state, dispatch] = React.useReducer(AuthReducer, authState);

  //  Update the state with status code received from localDB Request
  //  Type: GET_DATA, POST_DATA, LOADING
  const watchServerAPI = (type, data) => {
    //  If data has a status props
    if (data?.status) {
      setServerAPIState(data.status);
      //  Show login modal if status is 401 (unauthorized)
      if (data.status === 401) {
        setShowLoginModal(true);
      }
    }
  };

  observerServerAPI.subscribe(watchServerAPI);

  const toggleLoginModal = () => {
    console.log("toggleLoginModal");
    setShowLoginModal(!showLoginModal);
  };

  return (
    <Router>
      <AuthContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        {showLoginModal ? <LoginModal toggle={toggleLoginModal} /> : ""}
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
