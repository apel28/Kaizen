import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import kaizenLogo from "../assets/kaizen-logo.webp";
import { House, Calendar, FileText, Clock, FlaskConical, Pill, LogOut, Stethoscope } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Home",         icon: <House />,        path: "/DoctorDashboard" },
  { label: "Prescription", icon: <FileText />,     path: "/DoctorDashboard/Prescription" },
  { label: "Availability", icon: <Calendar />,     path: "/DoctorDashboard/Availability" },
  { label: "Vitals",       icon: <Clock />,         path: "/DoctorDashboard/PatientVitals" },
  { label: "Conditions",   icon: <Stethoscope />, path: "/DoctorDashboard/PatientConditions" },
  { label: "Unknown 5",   icon: <Pill />,         path: null },
];

const DoctorSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-64 shrink-0 sticky top-0 h-[calc(100vh-2rem)] flex flex-col border border-gray-700 bg-gray-800/50 text-white p-6 rounded-2xl font-sans overflow-y-auto">
      <div className="flex justify-center items-center">
        <img src={kaizenLogo} alt="Kaizen Logo" className="w-40 mb-10 max-w-full" />
      </div>
      <nav>
        <ul>
          {navItems.map(({ label, icon, path }, index) => (
            <li
              key={label}
              onClick={() => path && navigate(path)}
              className={`mb-4 p-3 rounded-lg transition-all ${path && pathname === path ? "bg-blue-600" : "hover:bg-gray-800"} ${path ? "cursor-pointer" : "cursor-default opacity-50"}`}
            >
              <div className="flex items-center gap-2">
                {icon}
                {label}
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex justify-center items-center">
        <button
          onClick={logout}
          className="mb-4 p-3 absolute bottom-4 rounded-lg cursor-pointer transition-all hover:bg-red-600/50"
        >
          <div className="flex items-center gap-2">
            <LogOut /> Log Out
          </div>
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
