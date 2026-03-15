import React, { useState } from "react";
import Button from "./Button";
import { Eye, EyeOff } from "lucide-react";

const LoginBlock = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClasses =
    "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";
  // className for login block

  return (
    <div className="login-block w-full max-w-md p-8 bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r text-blue-500 bg-clip-text text-transparent">
        Login
      </h2>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className={inputClasses}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={inputClasses}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={onToggle}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Don't have an account? Sign Up
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <Button text="Sign In" />
        </div>
      </div>
    </div>
  );
};

export default LoginBlock;
