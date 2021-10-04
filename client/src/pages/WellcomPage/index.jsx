import React from "react";
import { Link } from "react-router-dom";

import "./index.css";

const WellcomePage = () => {
  return (
    <div className="WellcomePage">
      <img
        src="/img/wellcomeImg.png"
        className="WellcomePage__img"
        alt="красная линия"
      />
      <div className="WellcomePage__title">Finance Goal</div>
      <div className="WellcomePage__text">
        Приложение, которое помогает достигать финасовых целей.
      </div>
      <div className="WellcomePage__text">
        Вы сможете трансформировать большую цель в десятки маленьких
        составляющих и увидеть на сколько просто добиться желаемого.
      </div>

      <Link className="Btn" to="/login">
        Начать
      </Link>
    </div>
  );
};

export default WellcomePage;
