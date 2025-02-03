import React from "react";
import "./PlayButton.css"; // Ensure to create and import the CSS file

const PlayButton = () => {
  return (
    <button>
      P L A Y
      <div id="clip">
        <div id="leftTop" class="corner"></div>
        <div id="rightBottom" class="corner"></div>
        <div id="rightTop" class="corner"></div>
        <div id="leftBottom" class="corner"></div>
      </div>
      <span id="rightArrow" class="arrow"></span>
      <span id="leftArrow" class="arrow"></span>
    </button>
  );
};

export default PlayButton;
