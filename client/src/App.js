import "./App.css";

import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

import { Context } from "./context/Context";
import Routes from "./Routes";

import { GET_USER_ID } from "./query/user";

const App = () => {
  const [getUserId, { data: dataUserId }] = useLazyQuery(GET_USER_ID);

  const [context, setContext] = useState({
    userId: null,
  });

  useEffect(() => {
    getUserId();
  }, [getUserId]);

  useEffect(() => {
    if (dataUserId) {
      setContext({
        userId: dataUserId?.userId,
        isAuth: !!dataUserId?.userId,
      });
    }
  }, [dataUserId]);

  return (
    <Context.Provider value={[context, setContext]}>
      <div className="App">
        <Routes />
      </div>
    </Context.Provider>
  );
};

export default App;
