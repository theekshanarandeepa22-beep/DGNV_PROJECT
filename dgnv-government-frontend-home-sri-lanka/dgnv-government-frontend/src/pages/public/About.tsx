import { FaHandsHelping, FaMapMarkedAlt, FaShieldAlt, FaUsers } from "react-icons/fa";
import Navbar from "../../components/common/Navbar";

const About = () => {
  return (
    <div className="public-shell modern-home public-content-page">
      <Navbar />
      <main className="info-page">
        <section className="info-hero">
          <div className="container">
            <span className="modern-section-label">ABOUT DGNV</span>
            <h1>Building a safer and more resilient Sri Lanka</h1>
            <p>DGNV is a digital disaster governance platform designed to connect citizens, government officers and relief partners during emergencies.</p>
          </div>
        </section>
        <section className="modern-section">
          <div className="container info-content">
            <div className="info-intro">
              <h2>Coordinated disaster response in one place</h2>
              <p>Citizens can report urgent needs, government officers can review and coordinate requests, and response partners can support relief activities. The platform keeps request information, location details and status updates together so each case can move through the response process clearly.</p>
            </div>
            <div className="info-feature-grid">
              <article><span><FaShieldAlt /></span><h3>Prepared Communities</h3><p>Give people a clear digital channel to request assistance and follow the progress of their case.</p></article>
              <article><span><FaUsers /></span><h3>Government Coordination</h3><p>Support officers with structured request review, assignment and response management.</p></article>
              <article><span><FaHandsHelping /></span><h3>Relief Partnerships</h3><p>Route approved requests to appropriate relief partners and keep response information connected.</p></article>
              <article><span><FaMapMarkedAlt /></span><h3>Location-Based Support</h3><p>Use District, DS Division and GS Division information to support local response coordination.</p></article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
