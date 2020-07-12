import React, { useState } from 'react';
import './Login.css';

import { NavLink } from 'react-router-dom';

const Login = ({ errorMessage, handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
  };
  return (
    <div className='login-container'>
      <h2>Log in into your account</h2>
      <form className='login-container__form'>
        {errorMessage ? <h3>Error login, try again</h3> : ''}
        <label>
          Email
          <input
            placeholder='Your email address'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            placeholder='Your password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <NavLink to='/forgotPassword'>Forgot your password ?</NavLink>
        </label>
        <div className='login-container__form__options'>
          <button
            onClick={onSubmit}
            className='login-container__form__options-submit'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
