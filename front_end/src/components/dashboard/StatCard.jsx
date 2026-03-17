import React from "react";

const StatCard = ({ title, value, unit, status, icon: Icon }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm flex justify-between items-start">
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">
            {value}
            <span className="text-lg ml-1 text-gray-400 font-medium">
              {unit}
            </span>
          </p>
        </div>
        <p className="text-green-400 text-xs mt-4 font-medium bg-green-900/20 px-2 py-1 rounded-md w-fit">
          {status}
        </p>
      </div>
      {Icon && (
        <div className="p-3 bg-gray-700/30 rounded-xl border border-gray-600">
          <Icon size={24} className="text-blue-400" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
