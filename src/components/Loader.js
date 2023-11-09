import React from "react";

function Loader(props) {
  return (
    <span
      className={`loader ${props.center ? "absolute left-1/2 top-1/2" : ""} ${
        props.white ? "loader-white" : ""
      }`}
      style={{ height: props.size, width: props.size }}
    ></span>
  );
}

export default Loader;
