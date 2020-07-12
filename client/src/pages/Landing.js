import React, { useState } from 'react';
import logo from '../logo.svg';
import './Landing.css';
import { Redirect } from 'react-router-dom';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import Login from '../components/Login';

const Landing = () => {
  const [redirect, setRedirect] = useState(null);
  const signIn = () => {
    setRedirect(<Redirect to='/main/' />);
  };
  return (
    <div className='landing'>
      {redirect}
      <header className='landing__header'>
        <img src={logo} className='landing__logo' alt='logo' />
      </header>
      <main>
        <Login />
        <div className='landing__social-buttons'>
          <GoogleLogin textButton='Google' />
          <FacebookLogin
            appId='273372737231849'
            fields='name, email, picture'
            icon='fa-facebook'
          />
        </div>
      </main>
    </div>
  );
};

export default Landing;
