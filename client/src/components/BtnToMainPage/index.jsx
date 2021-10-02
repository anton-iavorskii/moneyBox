import React from "react";
import { useHistory } from "react-router-dom";
import "./index.css";

const BtnToMainPage = () => {
  const history = useHistory();

  const handlerToMainPage = () => {
    history.push("/");
  };

  return (
    <img
      className="BtnToMainPage"
      src="/img/btn_goBack.svg"
      onClick={handlerToMainPage}
    />
  );
};

export default BtnToMainPage;
