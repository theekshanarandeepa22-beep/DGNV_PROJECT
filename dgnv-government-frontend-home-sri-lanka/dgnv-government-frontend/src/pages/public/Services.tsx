import {
  FaAmbulance, FaFireExtinguisher, FaHandsHelping, FaHome, FaShieldAlt, FaTruck, FaWater, FaClipboardList,
} from "react-icons/fa";
import Navbar from "../../components/common/Navbar";

const serviceItems = [
  ["Disaster Reporting", "Report a disaster or urgent community need and keep the request available for follow-up.", FaClipboardList],
  ["Food & Water Relief", "Coordinate requests for drinking water, food and essential relief supplies.", FaWater],
  ["Medical Assistance", "Route urgent medical assistance requests to the appropriate response teams and partners.", FaAmbulance],
  ["Rescue & Evacuation", "Support rescue, transport and evacuation requests during floods and other emergencies.", FaTruck],
  ["Temporary Shelter", "Coordinate requests for safe temporary accommodation for affected families.", FaHome],
  ["Fire & Emergency Support", "Support fire, rescue and other urgent emergency response needs.", FaFireExtinguisher],
  ["Security Support", "Record and coordinate community safety and security support requests.", FaShieldAlt],
  ["NGO Relief Coordination", "Connect approved government requests with suitable relief and volunteer partners.", FaHandsHelping],
];

const Services = () => {
  return (
    <div className="public-shell modern-home public-content-page">
      <Navbar />
      <main className="info-page">
        <section className="info-hero info-hero-services">
          <div className="container">
            <span className="modern-section-label">DGNV SERVICES</span>
            <h1>Disaster support for communities across Sri Lanka</h1>
            <p>Services that help citizens report needs, officers coordinate response, and relief partners support affected communities.</p>
          </div>
        </section>
        <section className="modern-section modern-section-soft">
          <div className="container">
            <div className="modern-section-heading">
              <div><span className="modern-section-label">OUR SERVICES</span><h2>Support across the response journey</h2></div>
            </div>
            <div className="modern-service-grid info-service-grid">
              {serviceItems.map(([title, text, Icon]) => (
                <article className="modern-service-card" key={title as string}>
                  <div className="modern-service-icon blue"><Icon /></div>
                  <h3>{title as string}</h3>
                  <p>{text as string}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;
