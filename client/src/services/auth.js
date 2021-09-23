import client from "../services/apollo";
import { createBrowserHistory } from "history";

const TOKEN_NAME = "moneyBox-token";
const history = createBrowserHistory();

export const login = (token) => {
  localStorage.setItem(TOKEN_NAME, token);
  client.resetStore();
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_NAME);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_NAME);
  client.resetStore();
  history.push("/login");
};

const Auth = {
  login,
  getToken,
  logout,
};

export default Auth;
