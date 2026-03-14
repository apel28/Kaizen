import "./landingPg.css";
import kaizenLogo from "./assets/kaizen-logo.png";

function LandingPg() {
  return (
    <div className="container">
      <div className="logo-section">
        <img src={kaizenLogo} alt="Kaizen Logo" className="logo" />
        <p className="tagline">Your health, Simplified</p>
      </div>
    </div>
  );
}

export default LandingPg;
