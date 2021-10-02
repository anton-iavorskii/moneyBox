//информация с сайта https://blog.logrocket.com/how-to-build-an-svg-circular-progress-component-using-react-and-react-hooks/

import React, { useEffect, useState, useRef } from "react";

import "./index.css";

const ProgressBar = (props) => {
  const { size, progress, strokeWidth, circleOneStroke, circleTwoStroke } =
    props;

  const [offset, setOffset] = useState(0);
  const circleRef = useRef(null);

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
    circleRef.current.style =
      "transition: stroke-dashoffset 850ms ease-in-out;";
  }, [setOffset, circumference, progress, offset]);

  return (
    <>
      <svg className="svg" width={size} height={size}>
        <circle
          className="svg-circle-bg"
          stroke={circleOneStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={7} // для добавления пунктиров (штрихов)
        />
        <circle
          className="svg-circle"
          stroke={circleTwoStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          ref={circleRef}
        />
        <text className="svg-circle-text" x={center} y={center}>
          {progress.toFixed(1)}%
        </text>
      </svg>
    </>
  );
};

export default ProgressBar;
