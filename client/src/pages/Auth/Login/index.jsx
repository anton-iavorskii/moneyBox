import "./index.css";
import React, { useEffect, useContext, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import Auth from "../../../services/auth";
import { SIGNIN } from "../../../mutation/user";

import { Context } from "../../../context/Context";
import Header from "../../../components/Header";

const LoginPage = () => {
  const [context, setContext] = useContext(Context);
  const history = useHistory();

  const [errorLogin, setErrorLogin] = useState(false);

  const [signin, { data: dataSingin }] = useMutation(SIGNIN);

  // схема валидации
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Заполните поле - Почта"),
    password: Yup.string().required("Заполните поле - Пароль"),
  });

  // начальные значения полей
  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (data) => {
    signin({ variables: { email: data.email, password: data.password } });
  };

  // login after get jwtToken
  useEffect(() => {
    if (dataSingin) {
      const token = dataSingin?.signin?.jwtToken;
      token === null && setErrorLogin(true);
      token && Auth.login(token);
    }
  }, [dataSingin]);

  // isAuth push homepage
  useEffect(() => {
    context.isAuth && history.push("/");
  }, [context, history]);

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    setValues,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="LoginPage">
      <Header />
      {errorLogin && (
        <div className="error">Проверьте правильность пароля или email</div>
      )}
      <form className="Form LoginPage__Form" onSubmit={handleSubmit}>
        <input
          className="Form__input LoginPage__Form_input"
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Почта"
        />
        {touched.email && errors.email ? (
          <div style={{ color: "red" }}>{errors.email}</div>
        ) : null}

        <input
          className="Form__input LoginPage__Form_input"
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Пароль"
        />
        {touched.password && errors.password ? (
          <div style={{ color: "red" }}>{errors.password}</div>
        ) : null}

        <button
          className="Form__btnSubmit LoginPage__Form_btnSubmit"
          type="submit"
        >
          Войти
        </button>
      </form>
      <div className="wrapperAuthLink">
        <div>Нет аккаунта?</div>
        <Link className="AuthLink" to="/reg">
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
