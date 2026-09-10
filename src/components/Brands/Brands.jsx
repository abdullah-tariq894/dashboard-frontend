import "./Brands.css";

import versace from "../../assets/versace.png";
import zara from "../../assets/zara.png";
import gucci from "../../assets/gucci.png";
import prada from "../../assets/prada.png";
import calvinKlein from "../../assets/calvin-klien.png";

function Brands() {
  return (
    <section className="brands">

      <img src={versace} alt="Versace" />

      <img src={zara} alt="Zara" />

      <img src={gucci} alt="Gucci" />

      <img src={prada} alt="Prada" />

      <img src={calvinKlein} alt="Calvin Klein" />

    </section>
  );
}

export default Brands;