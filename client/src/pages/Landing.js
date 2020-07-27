import React, { useState } from "react";
import AuthContext from "../hooks/AuthContext";
import logo from "../logo.svg";
import "./Landing.css";
import { Redirect } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

import Login from "../components/Login";
import Register from "../components/Register";

const axios = require("axios");

const Landing = () => {
  const initialState = {
    isSubmitting: false,
    errorMessage: null,
  };
  const [showLogin, setShowLogin] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [data, setData] = React.useState(initialState);
  const { dispatch } = React.useContext(AuthContext);
  const signIn = () => {
    setRedirect(<Redirect to="/main/" />);
  };
  //  Show the login component on click
  const toggleSignIn = (e) => {
    e.preventDefault();
    setShowLogin(!showLogin);
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
  const handleRegister = ({ name, surname, email, password }) => {
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
    const body = JSON.stringify({ name, surname, email, password });
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
    <div className="landing">
      {redirect}
      <header className="landing__header">
        <img src={logo} className="landing__logo" alt="logo" />
      </header>
      <main>
        {showLogin ? (
          <Login errorMessage={data.errorMessage} handleLogin={handleLogin} />
        ) : (
          <Register
            errorMessage={data.errorMessage}
            handleRegister={handleRegister}
          />
        )}
        <div className="landing__login-buttons">
          {!showLogin ? (
            <button
              className="landing__login-buttons-login"
              onClick={toggleSignIn}
            >
              Sign in to get started
            </button>
          ) : (
            <button
              className="landing__login-buttons-login"
              onClick={toggleSignIn}
            >
              Register
            </button>
          )}

          <GoogleLogin
            clientId="628640082803-2uilqn4bakk825nqr40fsrdglq5a8a5q.apps.googleusercontent.com"
            onSuccess={responseGoogle}
            className="landing__login-buttons-google"
            textButton="Google"
          />
          <FacebookLogin
            appId="273372737231849"
            fields="name, email, picture"
            callback={responseFacebook}
            icon="fa-facebook"
            className="landing__login-buttons-google"
          />
        </div>
      </main>
    </div>
  );
};

export default Landing;
