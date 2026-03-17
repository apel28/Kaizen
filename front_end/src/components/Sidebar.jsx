import React from "react";
import kaizenLogo from "../assets/kaizen-logo.webp";

const Sidebar = ({ idx }) => {
  const navItems = [
    "Home",
    "Appointment",
    "Prescription",
    "Schedule",
    "Tests",
    "Medication",
  ];

  return (
    <aside className="w-64 border border-gray-700 bg-gray-800/50 text-white p-6 rounded-l-2xl font-sans">
      {/* <h1 className="text-3xl font-bold mb-10 text-blue-400">Kaizen</h1> */}
      <div className="flex justify-center items-center">
        <img
          src={kaizenLogo}
          alt="Kaizen Logo"
          className="w-40 mb-10 max-w-full"
        />
      </div>
      <nav>
        <ul>
          {navItems.map((item, index) => (
            <li
              key={item}
              className={`mb-4 p-3 rounded-lg cursor-pointer transition-all ${index === idx ? "bg-blue-600" : "hover:bg-gray-800"}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
