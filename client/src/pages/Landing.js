import React, { useState } from 'react';
import { AuthContext } from '../App';
import logo from '../logo.svg';
import './Landing.css';
import { Redirect } from 'react-router-dom';

import FacebookLogin from 'react-facebook-login';

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
    console.log('responseFacebook', res);
    console.log('accessToken', accessToken);
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    //  Send the access token to our backend
    fetch('http://localhost:5000/auth/oauth/facebook', {
      method: 'post',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    }).then((res) => {
      console.log('fetch: ', res);
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
