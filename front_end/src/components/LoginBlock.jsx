import React from "react";
import Button from "./Button";

const LoginBlock = () => {
  return (
    <div className="login-block w-full max-w-md p-8 bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Login
      </h2>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex justify-center mt-4">
          <Button text="Sign In" />
        </div>
      </div>
    </div>
  );
};

export default LoginBlock;
