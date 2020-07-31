import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./Authenticate.css";

import Login from "./Login";
import Register from "./Register";

import { status } from "../services/subscribers";
import AuthContext from "../hooks/AuthContext";

import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const axios = require("axios");

const Authenticate = () => {
  const initialState = {
    isSubmitting: false,
    errorMessage: null,
  };
  const [showLogin, setShowLogin] = useState(true);
  const [redirect, setRedirect] = useState("");

  const [data, setData] = React.useState(initialState);
  const { dispatch } = React.useContext(AuthContext);

  const signIn = () => {
    setRedirect(<Redirect to="/main/" />);
  };
  const showLoginButton = () => {
    return (
      <button
        onClick={(e) => {
          setShowLogin(true);
        }}
        className="login-login-container__form__options-submit"
      >
        Or log in with your account
      </button>
    );
  };
  const showRegisterButton = () => {
    return (
      <button
        onClick={(e) => setShowLogin(false)}
        className="login-login-container__form__options-submit"
      >
        Register an account
      </button>
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
        //  Finally, redirect to main
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
        //  Finally, redirect to main
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
        //  Finally, redirect to mains
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
    console.log("accessToken", accessToken);
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
        //  Finally, redirect to mains
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
      {redirect}
      {showLogin ? (
        <Login onLoginSubmit={handleLogin} error={data.errorMessage} />
      ) : (
        <Register handleRegister={handleRegister} error={data.errorMessage} />
      )}

      <div className="oauth-login-container">
        {showLogin ? showRegisterButton() : showLoginButton()}
        <GoogleLogin
          clientId="628640082803-2uilqn4bakk825nqr40fsrdglq5a8a5q.apps.googleusercontent.com"
          onSuccess={responseGoogle}
          className="oauth-login__button-google"
          textButton="Google"
        />
        <FacebookLogin
          appId="273372737231849"
          fields="name, email, picture"
          callback={responseFacebook}
          icon="fa-facebook"
          className="oauth-login__button-google"
        />
      </div>
    </div>
  );
};

export default Authenticate;
