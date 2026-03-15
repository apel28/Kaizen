import React from "react";

const Button = ({ text = "Get Started", onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white bg-blue-800 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
    >
      {text}
    </button>
  );
};

export default Button;
