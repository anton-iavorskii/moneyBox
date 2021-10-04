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
import ProgressBar from "../../components/ProgressBar";
import addSpaceInNumbers from "../../services/spaceInNumbers";

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
      alert(`Удалить цель ${boxTitle}?`);
      removeBox({
        variables: {
          boxId: boxId,
        },
      });
    }
    history.push("/");
  };

  const progressPercent = (paymentsTrue * 100) / boxAmount;

  return (
    <div className="BoxPage">
      <Header />
      <ProgressBar
        progress={progressPercent}
        size={200}
        strokeWidth={5}
        circleOneStroke="red"
        circleTwoStroke="#e5e7f7"
      />
      <div className="BoxPage__NavigationWrapper">
        <img src="/img/btn_delete.svg" onClick={removeBoxHandler} />
        <div className="BoxPage__TitleWrapper">
          <div className="BoxPage__BoxTitle"> {boxTitle}</div>
          <div className="BoxPage__BoxAmount">
            цель {boxAmount && addSpaceInNumbers(boxAmount)} руб.
          </div>
        </div>
        <BtnToMainPage />
      </div>

      <div className="BoxPage__infoWrapper">
        <div className="BoxPage__info ">
          <div className="BoxPage__info_createdAt">
            {moment(boxCreatedAt).format("D MMMM YYYY")}
          </div>
          <div className="BoxPage__info_textInBlock">цель поставлена</div>
        </div>
        <div className="BoxPage__info">
          <div className="BoxPage__info_time">
            {boxTime === 13 && "3 месяца"}
            {boxTime === 26 && "6 месяцев"}
            {boxTime === 52 && "1 год"}
          </div>
          <div className="BoxPage__info_textInBlock">срок</div>
        </div>
        <div className="BoxPage__info">
          <div className="BoxPage__info_paymentsTrue">
            {paymentsTrue && addSpaceInNumbers(paymentsTrue)} руб.
          </div>
          <div className="BoxPage__info_textInBlock">накоплено</div>
        </div>
        <div className="BoxPage__info">
          <div className="BoxPage__info_balance">
            {boxAmount &&
              paymentsTrue &&
              addSpaceInNumbers(boxAmount - paymentsTrue)}{" "}
            руб.
          </div>
          <div className="BoxPage__info_textInBlock">осталось накопить</div>
        </div>
      </div>

      <div className="BoxPage__wrapperPayments">
        {payments?.map((item, index) => {
          return (
            <div
              className="BoxPage__paymentsContainer"
              key={index}
              onClick={() => changeStatusPayment(item.id, item.status)}
            >
              <div
                className={`BoxPage__payment ${item.status && "--selected"}`}
              >
                {addSpaceInNumbers(item.value)}
              </div>
              <div className={`${item.status && "BoxPage__paymenLine1"}`}></div>
              <div className={`${item.status && "BoxPage__paymenLine2"}`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoxPage;
