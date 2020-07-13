import React, { useState } from 'react';
import './Register.css';

import { NavLink } from 'react-router-dom';

const Register = ({ errorMessage, handleRegister }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      handleRegister({ name, surname, email, password });
    } else {
      setPasswordError("Password doesn't match!");
      setTimeout(() => {
        setPasswordError(null);
      }, 5000);
    }
  };
  return (
    <div className='register-container'>
      <h2>Register</h2>
      <form className='register-container__form'>
        {errorMessage ? <h3>Error, try again</h3> : ''}
        {passwordError ? <h3>{passwordError}</h3> : ''}
        <label>
          Name
          <input
            placeholder='Your name'
            type='text'
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Surname
          <input
            placeholder='Your surname'
            type='text'
            onChange={(e) => setSurname(e.target.value)}
          />
        </label>
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
        <label>
          Confirm password
          <input
            placeholder='Your password'
            type='password'
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
