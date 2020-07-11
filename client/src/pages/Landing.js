import React, { useState } from 'react';
import logo from '../logo.svg';
import './Landing.css';
import { Redirect } from 'react-router-dom';

import FacebookLogin from 'react-facebook-login';

const Landing = () => {
  const [redirect, setRedirect] = useState(null);
  const signIn = () => {
    setRedirect(<Redirect to='/main/' />);
  };
  const responseFacebook = (res) => {
    console.log('responseFacebook', res);
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
