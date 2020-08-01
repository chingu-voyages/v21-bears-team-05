import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../logo.svg";
import "./NavBar.css";

const NavBar = () => {
  return (
    <>
      <div className="nav">
        {/*<NavLink to="/">
          <img src={logo} className="layout__logo" alt="logo" />
  </NavLink>*/}
        <NavLink
          to="/Main"
          className="nav__link"
          activeClassName="nav__link--active"
        >
          <svg
            viewBox="0 0 40 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.4 32V21.0588H23.6V32H32.6V17.4118H38L20 1L2 17.4118H7.4V32H16.4Z" />
          </svg>
        </NavLink>
        <NavLink
          to="/Cupboard"
          className="nav__link"
          activeClassName="nav__link--active"
        >
          <svg
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 12.1621H23.4902M19.699 22.2661V16.0921M21.2961 16.592H20.199M21.2961 22.0801H20.199M1 1H23.4902V31.1842H1V1Z" />
          </svg>
        </NavLink>
        <NavLink
          to="/profile"
          className="nav__link"
          activeClassName="nav__link--active"
        >
          <svg
            viewBox="0 0 28 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.3984 13.582C17.9531 15.0273 16.1953 15.75 14.125 15.75C12.0547 15.75 10.2773 15.0273 8.79297 13.582C7.34766 12.0977 6.625 10.3203 6.625 8.25C6.625 6.17969 7.34766 4.42188 8.79297 2.97656C10.2773 1.49219 12.0547 0.75 14.125 0.75C16.1953 0.75 17.9531 1.49219 19.3984 2.97656C20.8828 4.42188 21.625 6.17969 21.625 8.25C21.625 10.3203 20.8828 12.0977 19.3984 13.582ZM19.3984 17.625C21.5469 17.625 23.3828 18.4062 24.9062 19.9688C26.4688 21.4922 27.25 23.3281 27.25 25.4766V27.9375C27.25 28.7188 26.9766 29.3828 26.4297 29.9297C25.8828 30.4766 25.2188 30.75 24.4375 30.75H3.8125C3.03125 30.75 2.36719 30.4766 1.82031 29.9297C1.27344 29.3828 1 28.7188 1 27.9375V25.4766C1 23.3281 1.76172 21.4922 3.28516 19.9688C4.84766 18.4062 6.70312 17.625 8.85156 17.625H9.84766C11.2148 18.25 12.6406 18.5625 14.125 18.5625C15.6094 18.5625 17.0352 18.25 18.4023 17.625H19.3984Z" />
          </svg>
        </NavLink>
      </div>
    </>
  );
};

export default NavBar;
