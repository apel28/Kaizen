import React, { useRef } from "react";
import "./landingPg.css";
import kaizenLogo from "./assets/kaizen-logo.webp";
import Button from "./components/Button";
import LoginBlock from "./components/LoginBlock";

function LandingPg() {
  const loginRef = useRef(null);

  const handleGetStarted = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  }; // Function for sliding animation

  return (
    <div className="landing-wrapper">
      <section className="hero-section">
        <div className="logo-section">
          <img src={kaizenLogo} alt="Kaizen Logo" className="logo" />
          <p className="tagline">Your health, Simplified</p>
        </div>
        <div className="button-container mt-[30px] w-full flex justify-center">
          <Button text="Get Started" onClick={handleGetStarted} />
        </div>
      </section>

      <section className="login-section" ref={loginRef}>
        <div className="login-container">
          <LoginBlock />
        </div>
      </section>
    </div>
  );
}

export default LandingPg;
