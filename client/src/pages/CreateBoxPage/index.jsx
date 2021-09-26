import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import "./index.css";

import { Context } from "../../context/Context";
import FormCreateBox from "../../components/FormCreateBox";

const CreateBoxPage = () => {
  const [context, setContext] = useContext(Context);
  const history = useHistory();
  const { userId } = context;

  return (
    <div className="CreateBoxPage">
      <FormCreateBox />
    </div>
  );
};

export default CreateBoxPage;
