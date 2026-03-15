import React, { useState } from "react";
import Button from "./Button";
import { Eye, EyeOff } from "lucide-react";
import { apiRequest } from "../utils/api"; // Importing helper

const LoginBlock = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Optimized handleSignIn - simple and direct connection to backend
  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevents page refresh
    setError("");
    setLoading(true);

    try {
      const result = await apiRequest("/signin", { email, password });
      console.log("Sign-in successful:", result);
      // alert("Login successful!"); // Minimum UI feedback
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";
  // className for login block

  return (
    <div className="login-block w-full max-w-md p-8 bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r text-blue-400 bg-clip-text text-transparent">
        Login
      </h2>

      <form onSubmit={handleSignIn} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className={inputClasses}
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Front end and react email synced
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            type="button"
            onClick={onToggle}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Don't have an account? Sign Up
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            text={loading ? "Signing In..." : "Sign In"}
            onClick={handleSignIn}
            disabled={loading} // Disables button while loading
          />
        </div>
      </form>
    </div>
  );
};

export default LoginBlock;
