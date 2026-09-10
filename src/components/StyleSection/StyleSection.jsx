import "./StyleSection.css";

import casual from "../../assets/casual.png";
import formal from "../../assets/formal.png";
import party from "../../assets/party.png";
import gym from "../../assets/gym.png";

function StyleSection() {
  return (
    <section className="style-section">

      <h2>BROWSE BY DRESS STYLE</h2>

      <div className="style-grid">

        <div className="style-card">
          <span>Casual</span>
          <img src={casual} alt="Casual" />
        </div>

        <div className="style-card">
          <span>Formal</span>
          <img src={formal} alt="Formal" />
        </div>

        <div className="style-card">
          <span>Party</span>
          <img src={party} alt="Party" />
        </div>

        <div className="style-card">
          <span>Gym</span>
          <img src={gym} alt="Gym" />
        </div>

      </div>

    </section>
  );
}

export default StyleSection;