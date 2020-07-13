import React, { useState } from 'react';
import './Register.css';

import { NavLink } from 'react-router-dom';

const Register = ({ errorMessage, handleRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleRegister({ email, password });
  };
  return (
    <div className='register-container'>
      <h2>Register</h2>
      <form className='register-container__form'>
        {errorMessage ? <h3>Error, try again</h3> : ''}
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
        </label>
        <div className='register-container__form__options'>
          <button
            onClick={onSubmit}
            className='register-container__form__options-submit'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
