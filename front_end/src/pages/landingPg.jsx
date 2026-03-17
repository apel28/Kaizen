import React, { useRef, useState } from "react";
import "./landingPg.css";
import kaizenLogo from "../assets/kaizen-logo.webp";
import Button from "../components/Button";
import LoginBlock from "../components/landingPg/LoginBlock";
import SignUpBlock from "../components/landingPg/SignUpBlock";

function LandingPg() {
  const loginRef = useRef(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleGetStarted = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  }; // Function for sliding animation

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

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
          {isLogin ? (
            <LoginBlock onToggle={toggleAuth} />
          ) : (
            <SignUpBlock onToggle={toggleAuth} />
          )}
        </div>
      </section>
    </div>
  );
}

export default LandingPg;
