import { useEffect, useRef, useState } from "react";
import "./App.css";
import kaizenLogo from "./assets/kaizen-logo.png";

function App() {
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const [heroInView, setHeroInView] = useState(true);
  const [formInView, setFormInView] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

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
      { threshold: 0.3, rootMargin: "0px" },
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
              <img src={kaizenLogo} alt="Kaizen logo" className="kaizen-logo" />
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
          <div
            className={`container ${isSignUp ? "right-panel-active" : ""}`}
            id="container"
          >
            {/* Sign Up Container */}
            <div className="form-container sign-up-container">
              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <h1 className="font-bold text-2xl mb-4">Create Account</h1>
                <div className="social-container">
                  {/* Social icons can go here if needed */}
                </div>
                <span className="text-sm mb-4">
                  or use your email for registration
                </span>

                <div className="scrollable-inputs">
                  <div className="input-group-row">
                    <input type="text" placeholder="First Name" required />
                    <input type="text" placeholder="Middle Name (Opt)" />
                  </div>
                  <div className="input-group-row">
                    <input type="text" placeholder="Last Name" required />
                    <select required defaultValue="">
                      <option value="" disabled>
                        User Type
                      </option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="input-group-row">
                    <input
                      type="date"
                      placeholder="Date of Birth"
                      required
                      title="Date of Birth"
                    />
                    <select required defaultValue="">
                      <option value="" disabled>
                        Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <input type="text" placeholder="Address (Optional)" />
                  <div className="input-group-row">
                    <input type="tel" placeholder="Contact Info" required />
                    <input type="tel" placeholder="Emergency Contact (Opt)" />
                  </div>
                  <div className="input-group-row">
                    <input type="text" placeholder="NID Number" required />
                    <input type="text" placeholder="Nationality" required />
                  </div>
                  <input type="email" placeholder="Email" required />
                  <input type="password" placeholder="Password" required />
                </div>

                <button className="btn-auth mt-4">Sign Up</button>
              </form>
            </div>

            {/* Sign In Container */}
            <div className="form-container sign-in-container">
              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <h1 className="font-bold text-3xl mb-4">Sign in</h1>
                <div className="social-container">{/* Social icons */}</div>
                <span className="text-sm mb-6">or use your account</span>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <a href="#" className="forgot-password">
                  Forgot your password?
                </a>
                <button className="btn-auth mt-4">Sign In</button>
              </form>
            </div>

            {/* Overlay */}
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1 className="font-bold text-3xl mb-4">Welcome Back!</h1>
                  <p className="mb-8">
                    To keep connected with us please login with your personal
                    info
                  </p>
                  <button
                    className="btn-ghost"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign In
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1 className="font-bold text-3xl mb-4">Hello, Friend!</h1>
                  <p className="mb-8">
                    Enter your personal details and start your journey with us
                  </p>
                  <button
                    className="btn-ghost"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
