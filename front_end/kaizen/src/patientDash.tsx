import { useEffect, useState } from "react";
import "./patientDash.css";

type PatientPage =
  | "Home"
  | "Appointment"
  | "Prescription"
  | "Schedule"
  | "Tests"
  | "Medication";

const NAV_ITEMS: { id: PatientPage; label: string; icon: string }[] = [
  { id: "Home", label: "Home", icon: "🏠" },
  { id: "Appointment", label: "Appointment", icon: "📅" },
  { id: "Prescription", label: "Prescription", icon: "💊" },
  { id: "Schedule", label: "Schedule", icon: "🕒" },
  { id: "Tests", label: "Tests", icon: "🧪" },
  { id: "Medication", label: "Medication", icon: "📦" },
];

const HEALTH_METRICS = [
  {
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    status: "Normal",
    icon: "❤️",
    trend: "up",
  },
  {
    label: "Blood Sugar",
    value: "110",
    unit: "mg/dL",
    status: "Optimal",
    icon: "🩸",
    trend: "down",
  },
  {
    label: "BMI",
    value: "22.4",
    unit: "kg/m²",
    status: "Healthy",
    icon: "⚖️",
    trend: "stable",
  },
  {
    label: "Sleep",
    value: "7.5",
    unit: "hrs",
    status: "Good",
    icon: "🌙",
    trend: "up",
  },
];

const UPCOMING_APPOINTMENTS = [
  {
    doctor: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    date: "Feb 28",
    time: "10:30 AM",
    type: "Check-up",
    status: "Confirmed",
  },
  {
    doctor: "Dr. Mark Ranson",
    specialty: "Dermatologist",
    date: "Mar 02",
    time: "02:15 PM",
    type: "Follow-up",
    status: "Pending",
  },
];

const ACTIVE_MEDICATIONS = [
  {
    name: "Amoxicillin",
    dosage: "500mg",
    schedule: "Twice a day",
    remaining: "12 days",
    color: "#6366f1",
  },
  {
    name: "Lisinopril",
    dosage: "10mg",
    schedule: "Once a day",
    remaining: "Ongoing",
    color: "#10b981",
  },
];

function PatientDash() {
  const [activePage, setActivePage] = useState<PatientPage>("Home");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`pd3-page ${isLoaded ? "pd3-page-loaded" : ""}`}>
      <div className="pd3-shell">
        <aside className="pd3-sidebar">
          <div className="pd3-sidebar-inner">
            <header className="pd3-brand">
              <div className="pd3-brand-logo">
                <div className="pd3-brand-icon" />
              </div>
              <span className="pd3-brand-name">Kaizen</span>
            </header>

            <nav className="pd3-nav" aria-label="Patient navigation">
              <ul className="pd3-nav-list">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.id === activePage;
                  return (
                    <li
                      key={item.id}
                      className={`pd3-nav-item ${
                        isActive ? "pd3-nav-item-active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="pd3-nav-button"
                        onClick={() => setActivePage(item.id)}
                      >
                        <span className="pd3-nav-icon">{item.icon}</span>
                        <span className="pd3-nav-label">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        <main className="pd3-main">
          <header className="pd3-main-header">
            <div className="pd3-main-title-group">
              <h1 className="pd3-main-title">Health Overview</h1>
              <p className="pd3-main-subtitle">
                Welcome back, Alex. Your stats look great today.
              </p>
            </div>
            <div className="pd3-main-actions">
              <button className="pd3-icon-btn">🔔</button>
              <div className="pd3-main-user">
                <div className="pd3-main-avatar">AK</div>
                <div className="pd3-main-user-text">
                  <span className="pd3-main-user-name">Alex Kaizen</span>
                  <span className="pd3-main-user-role">Patient ID: #8821</span>
                </div>
                <span className="pd3-main-user-arrow">⌄</span>
              </div>
            </div>
          </header>

          <section className="pd3-main-grid">
            <div className="pd3-col-left">
              {/* Health Metrics Grid */}
              <div className="pd3-metrics-row">
                {HEALTH_METRICS.map((metric, idx) => (
                  <div key={idx} className="pd3-metric-card">
                    <div className="pd3-metric-top">
                      <div className="pd3-metric-icon">{metric.icon}</div>
                      <div
                        className={`pd3-metric-trend pd3-trend-${metric.trend}`}
                      >
                        {metric.trend === "up"
                          ? "↑"
                          : metric.trend === "down"
                            ? "↓"
                            : "→"}
                      </div>
                    </div>
                    <div className="pd3-metric-content">
                      <p className="pd3-metric-label">{metric.label}</p>
                      <p className="pd3-metric-value">
                        {metric.value}{" "}
                        <span className="pd3-metric-unit">{metric.unit}</span>
                      </p>
                      <span
                        className={`pd3-metric-status pd3-status-${metric.status.toLowerCase()}`}
                      >
                        {metric.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming Appointments */}
              <section className="pd3-card pd3-card-appointments">
                <header className="pd3-card-header">
                  <h2 className="pd3-card-heading">Upcoming Appointments</h2>
                  <button className="pd3-view-all">View Calendar</button>
                </header>
                <div className="pd3-appointment-list">
                  {UPCOMING_APPOINTMENTS.map((apt, idx) => (
                    <div key={idx} className="pd3-appointment-item">
                      <div className="pd3-apt-date-box">
                        <span className="pd3-apt-month">
                          {apt.date.split(" ")[0]}
                        </span>
                        <span className="pd3-apt-day">
                          {apt.date.split(" ")[1]}
                        </span>
                      </div>
                      <div className="pd3-apt-info">
                        <h4>{apt.doctor}</h4>
                        <p>
                          {apt.specialty} • {apt.type}
                        </p>
                        <div className="pd3-apt-meta">
                          <span className="pd3-apt-time">🕒 {apt.time}</span>
                          <span
                            className={`pd3-apt-status status-${apt.status.toLowerCase()}`}
                          >
                            {apt.status}
                          </span>
                        </div>
                      </div>
                      <button className="pd3-apt-btn">Reschedule</button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="pd3-col-right">
              {/* Overall Health Score Circle */}
              <section className="pd3-card pd3-card-score">
                <h2 className="pd3-card-heading">Overall Health</h2>
                <div className="pd3-score-container">
                  <div className="pd3-score-ring">
                    <svg viewBox="0 0 36 36" className="pd3-score-svg">
                      <path
                        className="pd3-score-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="pd3-score-progress"
                        strokeDasharray="85, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="pd3-score-text">
                      <span className="pd3-score-number">85</span>
                      <span className="pd3-score-label">Excellent</span>
                    </div>
                  </div>
                </div>
                <p className="pd3-score-desc">
                  You are in the top 5% of healthy individuals this week!
                </p>
              </section>

              {/* Active Medications */}
              <section className="pd3-card pd3-card-medications">
                <header className="pd3-card-header">
                  <h2 className="pd3-card-heading">Active Medications</h2>
                </header>
                <div className="pd3-med-list">
                  {ACTIVE_MEDICATIONS.map((med, idx) => (
                    <div key={idx} className="pd3-med-item">
                      <div
                        className="pd3-med-icon"
                        style={{
                          backgroundColor: `${med.color}15`,
                          color: med.color,
                        }}
                      >
                        💊
                      </div>
                      <div className="pd3-med-details">
                        <div className="pd3-med-row">
                          <h4>{med.name}</h4>
                          <span className="pd3-med-rem">{med.remaining}</span>
                        </div>
                        <p>
                          {med.dosage} • {med.schedule}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="pd3-med-btn-add">+ Add Medication</button>
              </section>

              {/* Health Tip */}
              <section className="pd3-card pd3-card-tip">
                <div className="pd3-tip-content">
                  <div className="pd3-tip-icon">💡</div>
                  <div className="pd3-tip-text">
                    <h3>Daily Health Tip</h3>
                    <p>
                      Stay hydrated! Drinking 8 glasses of water daily improves
                      skin health and energy levels.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PatientDash;
