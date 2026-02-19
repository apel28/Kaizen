import { useEffect, useRef, useState } from "react";
import "./App.css";
import kaizenLogo from "./assets/kaizen-logo.png";

function App() {
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const [heroInView, setHeroInView] = useState(true);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const heroEl = heroRef.current;
    const formEl = formRef.current;
    if (!heroEl || !formEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroEl) {
            setHeroInView(entry.isIntersecting);
          }
          if (entry.target === formEl) {
            setFormInView(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px" }
    );

    observer.observe(heroEl);
    observer.observe(formEl);
    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
        <div className="particle particle-7"></div>
        <div className="particle particle-8"></div>
      </div>
      <div className="app-wrapper">
        <section
          ref={heroRef}
          className={`hero-section ${heroInView ? "hero-visible" : "hero-exit"}`}
        >
          <main className="app-root">
            <div className="hero-content">
              <img
                src={kaizenLogo}
                alt="Kaizen logo"
                className="kaizen-logo"
              />
              <h1 className="tagline">Your Health, Simplified</h1>
              <button
                type="button"
                className="btn-get-started"
                onClick={handleGetStarted}
              >
                Get started
              </button>
            </div>
          </main>
        </section>
        <section
          ref={formRef}
          className={`form-section ${formInView ? "form-visible" : "form-hidden"}`}
        >
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="form-title">Get started</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <button type="submit" className="btn-submit">
              Continue
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

export default App;
