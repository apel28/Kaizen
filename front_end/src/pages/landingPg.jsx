import React, { useRef, useState } from "react";
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
    <div className="min-h-screen overflow-y-auto snap-y snap-mandatory bg-gradient-to-br from-[#0a0a3a] to-black text-white font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <section className="h-screen w-full flex flex-col justify-center items-center relative snap-start">
        <div className="text-center flex flex-col justify-center items-center w-full">
          <img
            src={kaizenLogo}
            alt="Kaizen Logo"
            className="max-w-[90%] h-auto w-[550px] mb-5"
          />
          <p className="text-2xl font-light tracking-wider">
            Your health, Simplified
          </p>
        </div>
        <div className="mt-[30px] w-full flex justify-center">
          <Button text="Get Started" onClick={handleGetStarted} />
        </div>
      </section>

      <section
        className="h-screen w-full flex flex-col justify-center items-center relative snap-start"
        ref={loginRef}
      >
        <div className="flex flex-col justify-center items-center w-full p-5">
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
