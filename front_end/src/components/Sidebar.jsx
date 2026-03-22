import React from "react";
import kaizenLogo from "../assets/kaizen-logo.webp";
import {House, Calendar, FileText, Clock, FlaskConical, Pill, LogOut} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ idx }) => {

  const {logout} = useAuth();

  const navItems = [
    "Home",
    "Appointment",
    "Prescription",
    "Schedule",
    "Tests",
    "Medication"
  ];

  const navIcons = [
    <House key="home" />,
    <Calendar key="appointment" />,
    <FileText key="prescription" />,
    <Clock key="schedule" />,
    <FlaskConical key="tests" />,
    <Pill key="medication" />,
    <LogOut key="logout" />
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
              <div className="flex items-center gap-2">
                {navIcons[index]}
                {item}
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex justify-center items-center"><button
            key="logout"
            onClick={logout}
            className={`mb-4 p-3 absolute bottom-4 rounded-lg cursor-pointer transition-all hover:bg-red-600/50`}
          >
            <div className="flex items-center gap-2">
              <LogOut key="logout" />
              Log Out
            </div>
          </button></div>
    </aside>
  );
};

export default Sidebar;
