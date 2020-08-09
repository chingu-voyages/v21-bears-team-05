import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./Authenticate.css";

import Login from "./Login";
import Register from "./Register";

import { status } from "../services/subscribers";
import AuthContext from "../hooks/AuthContext";

import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const axios = require("axios");

const Authenticate = () => {
  const history = useHistory();
  const location = useLocation();
  const initialState = {
    isSubmitting: false,
    errorMessage: null,
  };
  const [showLogin, setShowLogin] = useState(true);

  const [data, setData] = React.useState(initialState);
  const { dispatch } = React.useContext(AuthContext);

  const signIn = () => {
    history.push("/");
    history.replace(location.pathname === "/" ? "/main" : location.pathname);
  };
  const onSwitch = (e) => {
    e.preventDefault();
    setData("");
    setShowLogin(false);
  };
  const showLoginButton = () => {
    return (
      <button
        onClick={(e) => {
          setShowLogin(true);
        }}
        className="oauth-login-container-local"
      >
        ← back to log in
      </button>
    );
  };
  const showOauthButtons = () => {
    return (
      <>
        <GoogleLogin
          clientId="628640082803-2uilqn4bakk825nqr40fsrdglq5a8a5q.apps.googleusercontent.com"
          onSuccess={responseGoogle}
          // className ="oauth-login__button-google"
					textButton="Google"
				  // style={{ padding: "1px", marginBottom: "5px" }}
        />
        <FacebookLogin
          appId="273372737231849"
					fields="name, email, picture"
					className="oauth-login__button-facebook"
          callback={responseFacebook}
					icon="fa-facebook"
					size="small"
					buttonStyle={{ marginTop: "5px" }}
        />
      </>
    );
  };
  //  Handle local login
  const handleLogin = ({ email, password }) => {
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, password });
    //  Send the access token received from Facebook
    //  Then dispatch our signed token  to the reducer
    axios
      .post("http://127.0.0.1:5000/auth/login", body, config)
      .then((res) => {
        dispatch({
          type: "LOGIN",
          payload: res.data,
        });
        status.clear();
        signIn();
      })
      .catch((error) => {
        console.log("error: ", error);
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error,
        });
      });
  };
  //  Handle local register
  const handleRegister = ({ email, password }) => {
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, password });
    //  Send the access token received from Facebook
    //  Then dispatch our signed token  to the reducer
    axios
      .post("http://127.0.0.1:5000/auth/register", body, config)
      .then((res) => {
        dispatch({
          type: "LOGIN",
          payload: res.data,
        });
        status.clear();
        signIn();
      })
      .catch((error) => {
        console.log("error: ", error);
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error,
        });
      });
  };
  //  Token and data received from Facebook OAUTH
  const responseFacebook = (res) => {
    const { accessToken } = res;

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ access_token: accessToken });
    //  Send the access token received from Facebook
    //  Then dispatch our signed token  to the reducer
    axios
      .post("http://127.0.0.1:5000/auth/oauth/facebook", body, config)
      .then((res) => {
        dispatch({
          type: "LOGIN",
          payload: res.data,
        });
        status.clear();
        signIn();
      })
      .catch((error) => {
        console.log("error: ", error);
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error,
        });
      });
  };
  //  Token and data received from Facebook OAUTH
  const responseGoogle = (res) => {
    const { accessToken } = res;
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ access_token: accessToken });
    //  Send the access token received from Facebook
    //  Then dispatch our signed token  to the reducer
    axios
      .post("http://127.0.0.1:5000/auth/oauth/google", body, config)
      .then((res) => {
        dispatch({
          type: "LOGIN",
          payload: res.data,
        });
        status.clear();
        signIn();
      })
      .catch((error) => {
        console.log("error: ", error);
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error,
        });
      });
  };
  return (
    <div className="authenticate-container">
      {showLogin ? (
        <Login
          onSwitch={onSwitch}
          onLoginSubmit={handleLogin}
          error={data.errorMessage}
        />
      ) : (
        <Register handleRegister={handleRegister} error={data.errorMessage} />
      )}

      <div className="oauth-login-container">
        {showLogin ? "" : showLoginButton()}
        {showLogin ? showOauthButtons() : ""}
      </div>
    </div>
  );
};

export default Authenticate;
