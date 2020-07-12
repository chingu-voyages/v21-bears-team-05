import React, { useState } from 'react';
import AuthContext from '../hooks/AuthContext';
import logo from '../logo.svg';
import './Landing.css';
import { Redirect } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import Login from '../components/Login';

const axios = require('axios');

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
    setRedirect(<Redirect to='/main/' />);
  };
  //  Show the login component on click
  const showSignIn = (e) => {
    e.preventDefault();
    setShowLogin(true);
  };

  const handleLogin = ({ email, password }) => {
    console.log('data', email, password);
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, password });
    //  Send the access token received from Facebook
    //  Then dispatch our signed token  to the reducer
    axios
      .post('http://127.0.0.1:5000/auth/login', body, config)
      .then((res) => {
        console.log(res);
        dispatch({
          type: 'LOGIN',
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log('error: ', error);
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error,
        });
      });
    //  Finally, redirect to mains
    signIn();
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
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ access_token: accessToken });
    //  Send the access token received from Facebook
    //  Then dispatch our signed token  to the reducer
    axios
      .post('http://127.0.0.1:5000/auth/oauth/facebook', body, config)
      .then((res) => {
        dispatch({
          type: 'LOGIN',
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log('error: ', error);
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error,
        });
      });
    //  Finally, redirect to mains
    signIn();
  };
  return (
    <div className='landing'>
      {redirect}
      <header className='landing__header'>
        <img src={logo} className='landing__logo' alt='logo' />
      </header>
      <main>
        {showLogin ? <Login handleLogin={handleLogin} /> : ''}
        <div className='landing__login-buttons'>
          {!showLogin ? (
            <button
              className='landing__login-buttons-login'
              onClick={showSignIn}
            >
              Sign in to get started
            </button>
          ) : (
            ''
          )}

          <GoogleLogin
            className='landing__login-buttons-google'
            textButton='Google'
          />
          <FacebookLogin
            appId='273372737231849'
            fields='name, email, picture'
            callback={responseFacebook}
            icon='fa-facebook'
            className='landing__login-buttons-google'
          />
        </div>
      </main>
    </div>
  );
};

export default Landing;
