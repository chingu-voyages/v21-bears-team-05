import React from "react";
import { NavLink } from "react-router-dom";
import "./Footerbar.css";

const FooterBar = () => {
  return (
    <>
      <div className="footerBar">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/Cupboard"}>Cupboard</NavLink>
        <div>Recipes Link</div>
        <div>Profile Link</div>
      </div>
    </>
  );
};

export default FooterBar;
