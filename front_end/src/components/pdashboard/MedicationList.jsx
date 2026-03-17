import React from "react";

const MedicationList = () => {
  const medications = [
    {
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "Twice a day",
      duration: "12 days",
    },
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once a day",
      duration: "Ongoing",
    },
  ];

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Active Medications</h3>
      </div>
      <ul>
        {medications.map((med, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
          >
            <div>
              <p className="font-bold">{med.name}</p>
              <p className="text-sm text-gray-400">
                {med.dosage} • {med.frequency}
              </p>
            </div>
            <span className="text-purple-400 font-medium text-sm">
              {med.duration}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationList;
