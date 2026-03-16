import React, { useState } from "react";
import Button from "./Button";
import { Eye, EyeOff } from "lucide-react";
import { apiRequest } from "../utils/api"; // Importing helper

const SignUpBlock = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    address: "",
    contact_info: "",
    emergency_contact: "",
    gender: "",
    nid: "",
    nationality: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: 2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "role" ? Number(value) : value,
    });
  };

  // Optimized handleSignUp - validates and calls API
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const trimOrNull = (v) => {
        const t = typeof v === "string" ? v.trim() : v;
        return t === "" ? null : t;
      };

      const payload = {
        first_name: formData.first_name.trim(),
        middle_name: trimOrNull(formData.middle_name),
        last_name: formData.last_name.trim(),
        date_of_birth: formData.date_of_birth, // must be YYYY-MM-DD
        address: trimOrNull(formData.address),
        contact_info: formData.contact_info.trim(),
        emergency_contact: trimOrNull(formData.emergency_contact),
        gender: formData.gender, // MALE/FEMALE/OTHERS
        nid: formData.nid.trim(),
        nationality: trimOrNull(formData.nationality),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      // Send data to /signup endpoint
      const result = await apiRequest("/signup", payload);
      console.log("Sign-up successful:", result);
      // alert("Registration successful! You can now log in.");
      onToggle(); // Switch to login view
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";

  return (
    <div className="signup-block w-full max-w-2xl p-8 bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl backdrop-blur-sm max-h-[90vh] overflow-y-auto custom-scrollbar">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Sign Up
      </h2>

      <form onSubmit={handleSignUp} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="first_name"
            placeholder="First Name"
            className={inputClasses}
            onChange={handleChange}
            required
          />
          <input
            name="middle_name"
            placeholder="Middle Name (Optional)"
            className={inputClasses}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="last_name"
            placeholder="Last Name"
            className={inputClasses}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className={`${inputClasses} appearance-none cursor-pointer text-gray-400`}
            onChange={handleChange}
            value={formData.role}
            required
          >
            <option value={2}>Patient</option>
            <option value={1}>Doctor</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="date_of_birth"
            type="date"
            className={`${inputClasses} text-gray-400`}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            className={`${inputClasses} appearance-none cursor-pointer text-gray-400`}
            onChange={handleChange}
            value={formData.gender}
            required
          >
            <option value="" disabled>
              Gender
            </option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHERS">Other</option>
          </select>
        </div>

        <input
          name="address"
          placeholder="Address (Optional)"
          className={inputClasses}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="contact_info"
            placeholder="Contact Info"
            className={inputClasses}
            onChange={handleChange}
            required
          />
          <input
            name="emergency_contact"
            placeholder="Emergency Contact (Optional)"
            className={inputClasses}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="nid"
            placeholder="NID Number"
            className={inputClasses}
            onChange={handleChange}
            required
          />
          <input
            name="nationality"
            placeholder="Nationality (Optional)"
            className={inputClasses}
            onChange={handleChange}
          />
        </div>

        <input
          name="email"
          type="email"
          placeholder="Email"
          className={inputClasses}
          onChange={handleChange}
          required
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={inputClasses}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={inputClasses}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onToggle}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Already have an account? Login
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            text={loading ? "Signing Up..." : "Sign Up"}
            onClick={handleSignUp}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default SignUpBlock;
