import "./index.css";
import React, { useEffect, useState, useContext } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Context } from "../../../context/Context";
import Auth from "../../../services/auth";

import { SIGNUP } from "../../../mutation/user";

const RegistrationPage = () => {
  const [context, setContext] = useContext(Context);
  const history = useHistory();

  const [signup, { data: dataSignup, error: errorSignup }] =
    useMutation(SIGNUP);

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
    signup({
      variables: {
        email: data.email,
        password: data.password,
      },
    });
  };

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
      <h1 className="">Страница регистрации</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Почта"
        />

        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Пароль"
        />

        <button type="submit">Регистрация</button>
      </form>
      <p>Уже регистрировались?</p>
      <Link to="/login">Войти</Link>
    </div>
  );
};

export default RegistrationPage;
