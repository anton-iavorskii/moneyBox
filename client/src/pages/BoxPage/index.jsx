import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import "./index.css";

import { Context } from "../../context/Context";
import Header from "../../components/Header";
import BtnToMainPage from "../../components/BtnToMainPage";
import moment from "../../services/moment";

import { UPDATE_PAYMENT } from "../../query/payments";
import { GET_BOX, REMOVE_BOX } from "../../query/boxes";

const BoxPage = () => {
  const [context, setContext] = useContext(Context);
  const { boxId } = useParams();
  const { userId } = context;
  const history = useHistory();

  const [paymentsTrue, setPaymentsTrue] = useState(0);

  const rqBox = [{ query: GET_BOX, variables: { boxId: boxId } }];

  const [getBox, { data: dataBox }] = useLazyQuery(GET_BOX);
  const boxTitle = dataBox?.box?.title;
  const boxAmount = dataBox?.box?.amount;
  const boxTime = dataBox?.box?.time;
  const boxCreatedAt = dataBox?.box?.createdAt;
  const payments = dataBox?.box?.payments?.nodes;

  const [updatePayment, { data: dataUpdatePayment }] = useMutation(
    UPDATE_PAYMENT,
    { refetchQueries: rqBox }
  );

  const [removeBox, { data: dataRemoveBox }] = useMutation(REMOVE_BOX);

  useEffect(() => {
    if (boxId) {
      getBox({
        variables: {
          boxId: boxId,
        },
      });
    }
  }, [boxId, getBox]);

  const changeStatusPayment = (paymentId, paymentStatus) => {
    updatePayment({
      variables: {
        payId: paymentId,
        status: !paymentStatus,
      },
    });
  };

  useEffect(() => {
    if (dataBox) {
      let arrPaymentsTrue = [];

      payments.forEach((item) => {
        if (item.status) {
          arrPaymentsTrue = [...arrPaymentsTrue, item.value];
        }
      });
      /* сумма всех чисел в массиве */
      let sumPayments = arrPaymentsTrue.reduce((sum, elem) => {
        return sum + elem;
      }, 0);

      setPaymentsTrue(sumPayments);
    }
  }, [dataBox, setPaymentsTrue]);

  const removeBoxHandler = () => {
    if (boxId) {
      alert(`Удалить копилку ${boxTitle}?`);
      removeBox({
        variables: {
          boxId: boxId,
        },
      });
    }
    history.push("/");
  };

  return (
    <div className="BoxPage">
      <Header />
      <h1>
        {boxTitle} - {boxAmount} руб.
      </h1>
      <BtnToMainPage />
      <div className="BtnRemoveBox" onClick={removeBoxHandler}>
        Удалить копилку
      </div>
      <div>Цель поставлена: {moment(boxCreatedAt).format("D MMMM YYYY")}</div>
      {/* <div>Надо накопить:  рублей.</div> */}
      <div>Срок: {boxTime} недель.</div>
      <div>Уже в копилке: {paymentsTrue} рублей.</div>
      <div>Осталось накопить: {boxAmount - paymentsTrue} рублей.</div>
      <div className="MainPage__wrapperPayments">
        {payments?.map((item, index) => {
          return (
            <div
              className={`MainPage__payment ${item.status && "--selected"}`}
              key={index}
              onClick={() => changeStatusPayment(item.id, item.status)}
            >
              {item.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoxPage;
