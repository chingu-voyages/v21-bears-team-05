import React from 'react';
import './Login.css';

import { NavLink } from 'react-router-dom';

const Login = () => {
  return (
    <div className='login-container'>
      <h2>Log in into your account</h2>
      <form className='login-container__form'>
        <label>
          Email
          <input placeholder='Your email address' type='email' />
        </label>
        <label>
          Password
          <input placeholder='Your password' type='password' />
          <NavLink to='/forgotPassword'>Forgot your password ?</NavLink>
        </label>
        <div className='login-container__form__options'>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
