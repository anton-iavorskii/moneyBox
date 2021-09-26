import React, { useEffect, useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import RegistrationPage from "./pages/Auth/Registration";
import LoginPage from "./pages/Auth/Login";

import MainPage from "./pages/MainPage";
import CreateBoxPage from "./pages/CreateBoxPage";
import { Context } from "./context/Context";

const Routes = () => {
  const [context, setContext] = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if (context.isAuth === false) {
      history.push("/login");
    }
  }, [context]);

  return (
    <Switch>
      <Route exact path="/reg" component={RegistrationPage} />
      <Route exact path="/login" component={LoginPage} />

      {context.isAuth && (
        <>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/createBox" component={CreateBoxPage} />
        </>
      )}
    </Switch>
  );
};

export default Routes;
