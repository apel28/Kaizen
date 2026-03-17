import React from "react";

const Button = ({
  text = "Get Started",
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`text-white bg-blue-800 box-border border border-transparent hover:bg-blue-700 focus:ring-4 focus:ring-blue-900 shadow-xs font-medium leading-5 rounded-full text-[16px] px-4 py-2.5 focus:outline-none transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {text}
    </button>
  );
};

export default Button;
