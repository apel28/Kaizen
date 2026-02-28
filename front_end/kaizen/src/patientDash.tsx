import { useEffect, useMemo, useState } from "react";
import "./landingPg.css";
import "./patientDash.css";
import kaizenLogo from "./assets/kaizen-logo.png";

type PatientPage =
  | "Home"
  | "Appointment"
  | "Prescription"
  | "Schedule"
  | "Tests"
  | "Medication";

const NAV_ITEMS: { id: PatientPage; label: string }[] = [
  { id: "Home", label: "Home" },
  { id: "Appointment", label: "Appointment" },
  { id: "Prescription", label: "Prescription" },
  { id: "Schedule", label: "Schedule" },
  { id: "Tests", label: "Tests" },
  { id: "Medication", label: "Medication" },
];

const TODAY_TIPS = [
  "Pause for 3 deep breaths before you move to the next task.",
  "Sip some water and straighten your posture for a moment.",
  "A short stretch break can reset both body and mind.",
  "Write down one small health win you had today.",
  "Look away from the screen and soften your eyes for 20 seconds.",
  "Stand up, roll your shoulders, and take a slow walk around the room.",
];

function PatientDash() {
  const [activePage, setActivePage] = useState<PatientPage>("Home");
  const [isLightMain, setIsLightMain] = useState(false);
  const [tipIndex, setTipIndex] = useState(
    () => Math.floor(Math.random() * TODAY_TIPS.length),
  );

  const pageSubtitle = useMemo(() => {
    switch (activePage) {
      case "Appointment":
        return "Review and manage your upcoming visits.";
      case "Prescription":
        return "See your current prescriptions at a glance.";
      case "Schedule":
        return "Plan your week and never miss a routine.";
      case "Tests":
        return "Track lab tests and recent results.";
      case "Medication":
        return "Stay on top of your daily medications.";
      case "Home":
      default:
        return "Here’s a snapshot of your health today.";
    }
  }, [activePage]);

  useEffect(() => {
    if (!TODAY_TIPS.length) return;
    const id = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TODAY_TIPS.length);
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <div className="particles">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
        <div className="particle particle-5" />
        <div className="particle particle-6" />
        <div className="particle particle-7" />
        <div className="particle particle-8" />
      </div>

      <div className="pdash-root">
        <div className="pdash-shell">
          <aside className="pdash-sidebar">
            <div className="pdash-brand">
              <div className="pdash-brand-logo-wrap">
                <img
                  src={kaizenLogo}
                  alt="Kaizen logo"
                  className="pdash-brand-logo"
                />
              </div>
              <div className="pdash-brand-text">
                <span className="pdash-brand-eyebrow">Kaizen</span>
                <span className="pdash-brand-title">Patient Space</span>
              </div>
            </div>

            <nav className="pdash-nav" aria-label="Patient navigation">
              <ul className="pdash-nav-list">
                {NAV_ITEMS.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <li
                      key={item.id}
                      className={`pdash-nav-item ${
                        isActive ? "pdash-nav-item-active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="pdash-nav-button"
                        onClick={() => setActivePage(item.id)}
                      >
                        <span className="pdash-nav-pill" />
                        <span className="pdash-nav-label">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="pdash-sidebar-footer">
              <div className="pdash-mini-card pdash-mini-card-muted">
                <p className="pdash-mini-card-title">Today&apos;s focus</p>
                <p className="pdash-mini-card-body">
                  {TODAY_TIPS[tipIndex]}
                </p>
              </div>
            </div>
          </aside>

          <main
            className={`pdash-main ${
              isLightMain ? "pdash-main-light" : "pdash-main-dark"
            }`}
          >
            <header className="pdash-header">
              <div className="pdash-header-text">
                <p className="pdash-header-eyebrow">Patient dashboard</p>
                <h1 className="pdash-header-title">Good evening, Alex</h1>
                <p className="pdash-header-subtitle">{pageSubtitle}</p>
              </div>

              <div className="pdash-header-actions">
                <div className="pdash-search">
                  <span className="pdash-search-icon">⌕</span>
                  <input
                    className="pdash-search-input"
                    placeholder="Search appointments, doctors, tests…"
                  />
                </div>
                <button
                  type="button"
                  className="pdash-toggle"
                  onClick={() => setIsLightMain((prev) => !prev)}
                >
                  {isLightMain ? "Dark panel" : "Light panel"}
                </button>
                <button
                  type="button"
                  className="pdash-icon-button pdash-icon-button-ghost"
                  aria-label="Notifications"
                >
                  ●
                </button>
                <button
                  type="button"
                  className="pdash-avatar"
                  aria-label="Patient profile"
                >
                  <span className="pdash-avatar-initials">AK</span>
                </button>
              </div>
            </header>

            <section className="pdash-content">
              <section className="pdash-hero-card">
                <div className="pdash-hero-main">
                  <p className="pdash-hero-eyebrow">Care plan</p>
                  <h2 className="pdash-hero-title">
                    Your health, in one smooth flow.
                  </h2>
                  <p className="pdash-hero-body">
                    Keep track of appointments, medications, and test results in
                    a single, calming view. We surface what matters most, right
                    when you need it.
                  </p>

                  <div className="pdash-hero-actions">
                    <button type="button" className="pdash-primary-button">
                      View full care plan
                    </button>
                    <button
                      type="button"
                      className="pdash-secondary-button"
                    >
                      Quick check-in
                    </button>
                  </div>
                </div>

                <div className="pdash-hero-visual">
                  <div className="pdash-hero-orbit">
                    <div className="pdash-hero-orbit-ring pdash-hero-orbit-ring-outer" />
                    <div className="pdash-hero-orbit-ring pdash-hero-orbit-ring-inner" />
                    <div className="pdash-hero-orbit-pulse" />
                  </div>
                  <div className="pdash-hero-metric-chip">
                    <span className="pdash-chip-label">Next appointment</span>
                    <span className="pdash-chip-value">Tue, 7:30 PM</span>
                  </div>
                  <div className="pdash-hero-metric-chip pdash-hero-metric-chip-secondary">
                    <span className="pdash-chip-label">Medication streak</span>
                    <span className="pdash-chip-value">12 days</span>
                  </div>
                </div>
              </section>

              <section className="pdash-metrics" aria-label="Key metrics">
                <article className="pdash-metric-card">
                  <p className="pdash-metric-label">Upcoming visits</p>
                  <p className="pdash-metric-value">3</p>
                  <p className="pdash-metric-hint">Next in 2 days</p>
                </article>

                <article className="pdash-metric-card">
                  <p className="pdash-metric-label">Active prescriptions</p>
                  <p className="pdash-metric-value">5</p>
                  <p className="pdash-metric-hint">2 need refills soon</p>
                </article>

                <article className="pdash-metric-card">
                  <p className="pdash-metric-label">Pending tests</p>
                  <p className="pdash-metric-value">2</p>
                  <p className="pdash-metric-hint">Blood work in progress</p>
                </article>

                <article className="pdash-metric-card">
                  <p className="pdash-metric-label">Medication adherence</p>
                  <p className="pdash-metric-value">92%</p>
                  <p className="pdash-metric-hint">Great consistency</p>
                </article>
              </section>

              <section className="pdash-grid" aria-label="Detailed overview">
                <article className="pdash-card pdash-card-large">
                  <header className="pdash-card-header">
                    <h3 className="pdash-card-title">Appointments</h3>
                    <span className="pdash-card-badge">This week</span>
                  </header>
                  <ul className="pdash-timeline">
                    <li className="pdash-timeline-item">
                      <span className="pdash-timeline-dot" />
                      <div className="pdash-timeline-content">
                        <p className="pdash-timeline-title">
                          Dr. Patel — Cardiology
                        </p>
                        <p className="pdash-timeline-meta">
                          Tue · 7:30 PM · Online
                        </p>
                      </div>
                    </li>
                    <li className="pdash-timeline-item">
                      <span className="pdash-timeline-dot" />
                      <div className="pdash-timeline-content">
                        <p className="pdash-timeline-title">
                          Lab visit — Blood panel
                        </p>
                        <p className="pdash-timeline-meta">
                          Thu · 9:00 AM · City Diagnostics
                        </p>
                      </div>
                    </li>
                    <li className="pdash-timeline-item">
                      <span className="pdash-timeline-dot" />
                      <div className="pdash-timeline-content">
                        <p className="pdash-timeline-title">
                          Follow-up — General check
                        </p>
                        <p className="pdash-timeline-meta">
                          Sat · 4:15 PM · In person
                        </p>
                      </div>
                    </li>
                  </ul>
                </article>

                <article className="pdash-card">
                  <header className="pdash-card-header">
                    <h3 className="pdash-card-title">Prescriptions</h3>
                  </header>
                  <ul className="pdash-list">
                    <li className="pdash-list-item">
                      <div>
                        <p className="pdash-list-title">Atorvastatin</p>
                        <p className="pdash-list-meta">
                          10mg · Night · 2 refills left
                        </p>
                      </div>
                      <span className="pdash-pill pdash-pill-soft">
                        Heart
                      </span>
                    </li>
                    <li className="pdash-list-item">
                      <div>
                        <p className="pdash-list-title">Metformin</p>
                        <p className="pdash-list-meta">
                          500mg · Morning &amp; Night
                        </p>
                      </div>
                      <span className="pdash-pill pdash-pill-soft">
                        Metabolic
                      </span>
                    </li>
                    <li className="pdash-list-item">
                      <div>
                        <p className="pdash-list-title">Vitamin D</p>
                        <p className="pdash-list-meta">Weekly · Sundays</p>
                      </div>
                      <span className="pdash-pill pdash-pill-soft">
                        Supplement
                      </span>
                    </li>
                  </ul>
                </article>

                <article className="pdash-card">
                  <header className="pdash-card-header">
                    <h3 className="pdash-card-title">Today&apos;s schedule</h3>
                  </header>
                  <ul className="pdash-checklist">
                    <li className="pdash-checklist-item">
                      <span className="pdash-check-toggle pdash-check-toggle-on" />
                      <div>
                        <p className="pdash-check-title">
                          Morning medication
                        </p>
                        <p className="pdash-check-meta">Completed · 8:00 AM</p>
                      </div>
                    </li>
                    <li className="pdash-checklist-item">
                      <span className="pdash-check-toggle" />
                      <div>
                        <p className="pdash-check-title">
                          10-minute breathing session
                        </p>
                        <p className="pdash-check-meta">
                          Recommended · Any time today
                        </p>
                      </div>
                    </li>
                    <li className="pdash-checklist-item">
                      <span className="pdash-check-toggle" />
                      <div>
                        <p className="pdash-check-title">
                          Evening medication
                        </p>
                        <p className="pdash-check-meta">Due · 8:00 PM</p>
                      </div>
                    </li>
                  </ul>
                </article>

                <article className="pdash-card pdash-card-tags">
                  <header className="pdash-card-header">
                    <h3 className="pdash-card-title">Tests &amp; meds</h3>
                  </header>
                  <div className="pdash-tags">
                    <span className="pdash-tag">Blood panel</span>
                    <span className="pdash-tag">ECG</span>
                    <span className="pdash-tag">Glucose monitor</span>
                    <span className="pdash-tag">Cholesterol</span>
                    <span className="pdash-tag">Sleep</span>
                    <span className="pdash-tag">Activity</span>
                  </div>
                </article>
              </section>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default PatientDash;

