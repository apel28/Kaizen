import React from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import AppointmentsList from "../components/dashboard/AppointmentsList";
import MedicationList from "../components/dashboard/MedicationList";

import { Activity, Droplets, Scale, Moon } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Heart Rate",
      value: 72,
      unit: "bpm",
      status: "Normal",
      icon: Activity,
    },
    {
      title: "Blood Sugar",
      value: 110,
      unit: "mg/dL",
      status: "Optimal",
      icon: Droplets,
    },
    {
      title: "BMI",
      value: 22.4,
      unit: "kg/m²",
      status: "Healthy",
      icon: Scale,
    },
    { title: "Sleep", value: 7.5, unit: "hrs", status: "Good", icon: Moon },
  ];

  return (
    <div className="text-white min-h-screen flex p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar idx={0} />
      <main className="flex-1 ml-6">
        <header className="flex justify-between items-center mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Overview
            </h2>
            <p className="text-gray-400 mt-1">Welcome, Alex.</p>
            
          </div>
          <div className="flex items-center bg-gray-700/30 px-4 py-2 rounded-xl border border-gray-600">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg mr-3 shadow-lg shadow-blue-900/20">
              AK
            </div>
            <div>
              <p className="font-bold">Alex</p>
              
              <p className="text-xs text-gray-400 font-mono">
                Patient ID: #8821 
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 ">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <AppointmentsList />
          <MedicationList />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
