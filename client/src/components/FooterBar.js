import React from "react";
import { NavLink } from "react-router-dom";
import "./Footerbar.css";
import logo from "../logo.svg";

const FooterBar = () => {
  return (
    <>
      <div className="footerBar">
        <img src={logo} className="layout__logo" alt="logo" />
        <NavLink to={"/Main"}>home</NavLink>
        <NavLink to={"/Cupboard"}>cupboard</NavLink>
        <div>recipes Link</div>
        <div>profile Link</div>
      </div>
    </>
  );
};

export default FooterBar;
