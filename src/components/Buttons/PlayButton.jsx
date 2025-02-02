import React from "react";
import "./PlayButton.css"; // Ensure to create and import the CSS file

const PlayButton = ({content}) => {
  return (
    <button className="play-button">
      {content}
      <div className="clip">
        <div className="corner left-top"></div>
        <div className="corner right-bottom"></div>
        <div className="corner right-top"></div>
        <div className="corner left-bottom"></div>
      </div>
      <span className="arrow right-arrow"></span>
      <span className="arrow left-arrow"></span>
    </button>
  );
};

export default PlayButton;
