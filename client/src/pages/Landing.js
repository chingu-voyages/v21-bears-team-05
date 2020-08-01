import React from 'react';
import logo from '../logo.svg';
import Button from '../components/Button';
import { NavLink } from "react-router-dom";
import './Landing.css';


const Landing = () => {
  return (
    <div className='landing'>
      <header className='landing__header'>
        <img src={logo} className='landing__logo' alt='logo' />
      </header>
      <main>
        <NavLink to="/Main">
          <Button>Feed Me!</Button>
        </NavLink>
      </main>
    </div>
  );
};

export default Landing;
