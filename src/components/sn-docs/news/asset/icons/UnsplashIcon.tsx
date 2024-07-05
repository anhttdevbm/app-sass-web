import React from "react";

const UnsplashIcon = () => {
  return (
    <svg
      viewBox="0 0 12 12"
      className="unsplashLogo"
      style={{
        width: 12,
        height: 12,
        display: "block",
        flexShrink: 0,
        marginRight: 4,
      }}
    >
      <path d="M3.75 3.375V0H8.25V3.375H3.75ZM8.25 5.25H12V12H0V5.25H3.75V8.625H8.25V5.25Z" />
    </svg>
  );
};

export default UnsplashIcon;
