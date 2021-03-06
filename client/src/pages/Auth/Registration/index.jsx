import "./index.css";
import React, { useEffect, useState, useContext } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Context } from "../../../context/Context";
import Auth from "../../../services/auth";

import { SIGNUP } from "../../../mutation/user";
import Header from "../../../components/Header";

const RegistrationPage = () => {
  const [context, setContext] = useContext(Context);
  const history = useHistory();

  const [signup, { data: dataSignup, error: errorSignup }] =
    useMutation(SIGNUP);

  // схема валидации
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Заполните поле - Почта"),
    password: Yup.string()
      .required("Заполните поле - Пароль")
      .min(6, "Введите не менее 6 символов"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Пароли не совпадают")
      .required("Подтвердите пароль"),
  });

  // начальные значения полей
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const onSubmit = (data) => {
    signup({
      variables: {
        email: data.email,
        password: data.password,
      },
    });
  };

  // error signup
  useEffect(() => {
    if (errorSignup) {
      const msg = errorSignup.message;
      if (msg.indexOf("users_email") !== -1) {
        alert("такой email уже существует");
      }
    }
  }, [errorSignup]);

  // after signup
  useEffect(() => {
    if (dataSignup) {
      const token = dataSignup.signup?.jwtToken;
      if (token) {
        Auth.login(token);
      }
    }
  }, [dataSignup]);

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

  useEffect(() => {
    if (context.isAuth) {
      history.push("/");
    }
  }, [context]);

  return (
    <div className="RegistrationPage">
      <Header />
      <form className="Form RegistrationPage__Form" onSubmit={handleSubmit}>
        <input
          className="Form__input RegistrationPage__Form_input"
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Укажите почту"
        />
        {touched.email && errors.email ? (
          <div style={{ color: "red" }}>{errors.email}</div>
        ) : null}

        <input
          className="Form__input RegistrationPage__Form_input"
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Придумайте пароль"
        />
        {touched.password && errors.password ? (
          <div style={{ color: "red" }}>{errors.password}</div>
        ) : null}

        <input
          className="Form__input RegistrationPage__Form_input"
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          placeholder="Повторите пароль"
        />
        {touched.confirmPassword && errors.confirmPassword ? (
          <div style={{ color: "red" }}>{errors.confirmPassword}</div>
        ) : null}

        <button
          className="Form__btnSubmit RegistrationPage__Form_btnSubmit"
          type="submit"
        >
          Регистрация
        </button>
      </form>
      <div className="wrapperAuthLink">
        <div>Уже регистрировались?</div>
        <Link className="AuthLink" to="/login">
          Войти
        </Link>
      </div>
    </div>
  );
};

export default RegistrationPage;
