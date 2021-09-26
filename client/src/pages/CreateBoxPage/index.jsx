import React, { useContext } from "react";

import "./index.css";

import FormCreateBox from "../../components/FormCreateBox";
import Header from "../../components/Header";
import BtnToMainPage from "../../components/BtnToMainPage";

const CreateBoxPage = () => {
  return (
    <div className="CreateBoxPage">
      <Header />
      <BtnToMainPage />
      <FormCreateBox />
    </div>
  );
};

export default CreateBoxPage;
