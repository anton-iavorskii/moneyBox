import React from "react";

import "./index.css";

import Auth from "../../services/auth";

const Header = () => {
  const handlerLogout = () => {
    Auth.logout();
  };

  return (
    <div className="Header">
      <div className="logo">FG</div>
      <div className="logoCenter">Finacial Goal</div>
      <img
        className="BtnLogout"
        src="/img/btn_logout.svg"
        onClick={handlerLogout}
      />
    </div>
  );
};

export default Header;
