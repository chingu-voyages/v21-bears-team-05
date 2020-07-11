import React, { useState } from 'react';
import { AuthContext } from '../App';
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

    //    Headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    //  Body
    const body = JSON.stringify({ access_token: accessToken });
    axios
      .post('http://127.0.0.1:5000/auth/oauth/facebook', body, config)
      .then((res) => {
        console.log('fetch: ', res.data);
      })
      .catch((err) => {
        console.log('error: ', err);
      });
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
