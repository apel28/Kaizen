import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import kaizenLogo from "../assets/kaizen-logo.webp";
import { House, Calendar, FileText, Clock, FlaskConical, Pill, LogOut, Activity, Stethoscope, AlertTriangle, Bell, Receipt } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Home",         icon: <House />,         path: "/PatientDashboard" },
  { label: "Appointment",  icon: <Calendar />,      path: "/Appointment" },
  { label: "Vitals",       icon: <Activity />,      path: "/PatientDashboard/Vitals" },
  { label: "Conditions",   icon: <Stethoscope />,   path: "/PatientDashboard/Conditions" },
  { label: "Allergies",    icon: <AlertTriangle />, path: "/PatientDashboard/Allergies" },
  { label: "Medication",   icon: <Pill />,          path: "/PatientDashboard/Medications" },
  { label: "Prescription", icon: <FileText />,      path: "/PatientDashboard/Prescriptions" },
  { label: "Tests Orders", icon: <FlaskConical />,  path: "/PatientDashboard/Tests" },
  { label: "Reports",      icon: <FileText />,      path: "/PatientDashboard/Reports" },
  { label: "Bills",        icon: <Receipt />,       path: "/PatientDashboard/Bills" },
  { label: "Notifications",icon: <Bell />,          path: "/PatientDashboard/Notifications" },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-64 shrink-0 sticky top-0 h-[calc(100vh-2rem)] flex flex-col border border-gray-700 bg-gray-800/50 text-white p-4 rounded-2xl font-sans overflow-hidden">
      <div className="flex justify-center items-center">
        <img src={kaizenLogo} alt="Kaizen Logo" className="w-40 mb-6 max-w-full" />
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-hide">
        <ul>
          {navItems.map(({ label, icon, path }, index) => (
            <li
              key={label}
              onClick={() => path && navigate(path)}
              className={`mb-1 p-2 rounded-lg transition-all flex items-center gap-3 ${path && pathname === path ? "bg-blue-600" : "hover:bg-gray-800"} ${path ? "cursor-pointer" : "cursor-default opacity-50 text-xs"}`}
            >
              <div className="shrink-0 scale-90">
                {icon}
              </div>
              <span className="text-sm font-medium">{label}</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 flex justify-center items-center">
        <button
          onClick={logout}
          className="w-full p-2 rounded-lg cursor-pointer transition-all hover:bg-red-600/50 flex items-center justify-center gap-2 text-sm border border-red-500/20"
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
