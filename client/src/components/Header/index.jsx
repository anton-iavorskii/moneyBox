import React from "react";
import { Link } from "react-router-dom";

import "./index.css";

import Auth from "../../services/auth";

const Header = () => {
  const handlerLogout = () => {
    Auth.logout();
  };

  return (
    <div className="Header">
      <Link to="/wellcome" className="logo">
        FG
      </Link>
      <Link to="/wellcome" className="logoCenter">
        Finacial Goal
      </Link>
      <img
        className="BtnLogout"
        src="/img/btn_logout.svg"
        onClick={handlerLogout}
      />
    </div>
  );
};

export default Header;
