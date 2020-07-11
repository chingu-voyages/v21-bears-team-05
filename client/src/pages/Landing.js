import React, { useState } from 'react';
import AuthContext from '../hooks/AuthContext';
import logo from '../logo.svg';
import './Landing.css';
import { Redirect } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
const axios = require('axios');

const Landing = () => {
  const initialState = {
    isSubmitting: false,
    errorMessage: null,
  };
  const [redirect, setRedirect] = useState(null);
  const [data, setData] = React.useState(initialState);
  const { dispatch } = React.useContext(AuthContext);
  const signIn = () => {
    setRedirect(<Redirect to='/main/' />);
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
        <button className='landing__signin' onClick={signIn}>
          Google Signin (TODO)
        </button>
        <FacebookLogin
          appId='273372737231849'
          textButton='Facebook'
          fields='name, email, picture'
          callback={responseFacebook}
        />
      </main>
    </div>
  );
};

export default Landing;
