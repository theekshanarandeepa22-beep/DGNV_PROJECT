import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaAmbulance,
  FaArrowRight,
  FaBell,
  FaCheckCircle,
  FaClipboardList,
  FaFireExtinguisher,
  FaHandsHelping,
  FaHeartbeat,
  FaHome,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaTruck,
  FaUsers,
  FaWater,
} from "react-icons/fa";
import Navbar from "../../components/common/Navbar";
import { getCitizens, getDashboardSummary, getOfficers } from "../../services/platformApi";
import type { DashboardSummary } from "../../types/platform";

const emptySummary: DashboardSummary = {
  totalRequests: 0,
  pending: 0,
  claimed: 0,
  approved: 0,
  rejected: 0,
  sentToNgo: 0,
};

const services = [
  { title: "Report a Disaster", text: "Submit an emergency request and track its progress.", icon: FaBell, link: "/login", tone: "red" },
  { title: "Food & Water Relief", text: "Coordinate essential food, drinking water and supplies.", icon: FaWater, link: "/services", tone: "blue" },
  { title: "Medical Assistance", text: "Connect urgent medical needs with response teams.", icon: FaHeartbeat, link: "/services", tone: "green" },
  { title: "Rescue & Evacuation", text: "Support rescue, transport and safe evacuation requests.", icon: FaTruck, link: "/services", tone: "orange" },
  { title: "Temporary Shelter", text: "Coordinate safe accommodation for displaced families.", icon: FaHome, link: "/services", tone: "purple" },
  { title: "Security Support", text: "Route community safety and security support requests.", icon: FaShieldAlt, link: "/services", tone: "navy" },
];

const emergencyNumbers = [
  { label: "Police", number: "119", icon: FaShieldAlt },
  { label: "Fire & Rescue", number: "110", icon: FaFireExtinguisher },
  { label: "Suwa Seriya Ambulance", number: "1990", icon: FaAmbulance },
  { label: "Disaster Management Centre", number: "117", icon: FaBell },
];

const responseSteps = [
  { title: "Report", text: "A citizen submits a disaster or relief request.", icon: FaClipboardList },
  { title: "Review", text: "A government officer checks the request and location.", icon: FaCheckCircle },
  { title: "Coordinate", text: "Approved requests are routed to the appropriate response partner.", icon: FaHandsHelping },
  { title: "Respond", text: "Support is delivered and progress is tracked through the platform.", icon: FaUsers },
];

const Home = () => {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [officerCount, setOfficerCount] = useState(0);
  const [citizenCount, setCitizenCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryData, officers, citizens] = await Promise.all([
          getDashboardSummary(),
          getOfficers(),
          getCitizens(),
        ]);
        setSummary(summaryData);
        setOfficerCount(officers.length);
        setCitizenCount(citizens.length);
      } catch {
        setSummary(emptySummary);
      }
    };
    void load();
  }, []);

  return (
    <div className="public-shell modern-home">
      <Navbar />

      <main>
        <section className="modern-hero">
          <div className="modern-hero-overlay" />
          <div className="modern-hero-glow modern-hero-glow-one" />
          <div className="modern-hero-glow modern-hero-glow-two" />

          <div className="container modern-hero-inner">
            <motion.div
              className="modern-hero-copy"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="modern-kicker">Safer Communities • Stronger Together</span>
              <h1>Disaster Resilient <span>Sri Lanka</span></h1>
              <p>
                A unified digital platform connecting citizens, government officers and NGOs
                for faster, smarter and more coordinated disaster response.
              </p>
              <div className="modern-hero-actions">
                <Link className="modern-primary-btn" to="/login">
                  Request Help <FaArrowRight />
                </Link>
                <a className="modern-secondary-btn" href="#about">
                  Learn More
                </a>
              </div>
              <div className="hero-trust-row">
                <span><FaCheckCircle /> Citizen reporting</span>
                <span><FaCheckCircle /> Government coordination</span>
                <span><FaCheckCircle /> NGO response</span>
              </div>
            </motion.div>

            <motion.div
              className="modern-hero-side"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="hero-side-card">
                <span className="hero-side-label">LIVE RESPONSE OVERVIEW</span>
                <div className="hero-side-stat">
                  <strong>{summary.totalRequests}</strong>
                  <span>Active requests</span>
                </div>
                <div className="hero-side-divider" />
                <div className="hero-mini-stats">
                  <div><strong>{officerCount}</strong><span>Officers</span></div>
                  <div><strong>{citizenCount}</strong><span>Citizens</span></div>
                  <div><strong>{summary.sentToNgo}</strong><span>NGO cases</span></div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="container hero-service-strip">
            <div className="hero-service-card">
              <div className="hero-service-icon hero-red"><FaBell /></div>
              <div><strong>Report a Disaster</strong><span>Submit and track a request</span></div>
              <FaArrowRight className="hero-service-arrow" />
            </div>
            <div className="hero-service-card">
              <div className="hero-service-icon hero-blue"><FaUsers /></div>
              <div><strong>For Government Officers</strong><span>Review and coordinate response</span></div>
              <FaArrowRight className="hero-service-arrow" />
            </div>
            <div className="hero-service-card">
              <div className="hero-service-icon hero-green"><FaHandsHelping /></div>
              <div><strong>For NGOs</strong><span>Provide relief and volunteer support</span></div>
              <FaArrowRight className="hero-service-arrow" />
            </div>
            <div className="hero-service-card">
              <div className="hero-service-icon hero-orange"><FaMapMarkedAlt /></div>
              <div><strong>Monitor & Track</strong><span>Follow response progress</span></div>
              <FaArrowRight className="hero-service-arrow" />
            </div>
          </div>
        </section>

        <section className="modern-section" id="about">
          <div className="container about-grid">
            <motion.div
              className="about-copy"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <span className="modern-section-label">ABOUT DGNV</span>
              <h2>Building a safer and more resilient Sri Lanka</h2>
              <p>
                The DGNV Disaster Governance Platform supports coordinated disaster response
                by connecting people who need assistance with government officers and relief
                partners. Requests can be submitted, reviewed, routed and tracked in one place.
              </p>
              <div className="about-points">
                <div><span><FaShieldAlt /></span><strong>Prepared Communities</strong><small>Better access to emergency support</small></div>
                <div><span><FaUsers /></span><strong>Coordinated Response</strong><small>Government and NGO collaboration</small></div>
                <div><span><FaMapMarkedAlt /></span><strong>Location Based Support</strong><small>Requests routed using local areas</small></div>
              </div>
              <Link className="modern-outline-btn" to="/about">Learn More About DGNV <FaArrowRight /></Link>
            </motion.div>
          </div>
        </section>

        <section className="modern-section modern-section-soft" id="services">
          <div className="container">
            <div className="modern-section-heading">
              <div><span className="modern-section-label">OUR SERVICES</span><h2>Support when your community needs it</h2></div>
              <Link to="/services" className="text-link">View all services <FaArrowRight /></Link>
            </div>
            <div className="modern-service-grid">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    className="modern-service-card"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className={`modern-service-icon ${service.tone}`}><Icon /></div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <Link to={service.link}>Learn more <FaArrowRight /></Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="emergency-section" id="emergency">
          <div className="container">
            <div className="emergency-header">
              <div><span className="modern-section-label">EMERGENCY CONTACTS</span><h2>Need immediate assistance?</h2></div>
              <p>For life-threatening emergencies, contact the appropriate emergency service directly.</p>
            </div>
            <div className="emergency-modern-grid">
              {emergencyNumbers.map((item) => {
                const Icon = item.icon;
                return (
                  <a href={`tel:${item.number}`} className="emergency-modern-card" key={item.number}>
                    <span className="emergency-modern-icon"><Icon /></span>
                    <span><strong>{item.label}</strong><b>{item.number}</b></span>
                    <FaPhoneAlt />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="modern-section">
          <div className="container">
            <div className="modern-section-heading centered-heading">
              <div><span className="modern-section-label">HOW IT WORKS</span><h2>From report to response</h2></div>
            </div>
            <div className="response-steps">
              {responseSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    className="response-step"
                    key={step.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <div className="response-number">0{index + 1}</div>
                    <div className="response-icon"><Icon /></div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-inner">
            <div><span className="modern-section-label">DGNV PLATFORM</span><h2>Help your community respond faster.</h2><p>Register as a citizen or access your government response portal.</p></div>
            <div className="cta-actions"><Link to="/register" className="modern-primary-btn">Create Account <FaArrowRight /></Link><Link to="/login" className="modern-secondary-dark-btn">Login</Link></div>
          </div>
        </section>
      </main>

      <footer className="modern-footer">
        <div className="container modern-footer-grid">
          <div><div className="footer-brand">DGNV</div><p>Disaster Governance Platform for a safer, more resilient Sri Lanka.</p></div>
          <div><strong>Platform</strong><Link to="/">Home</Link><Link to="/about">About</Link><Link to="/services">Services</Link></div>
          <div><strong>Emergency</strong><a href="#emergency">Emergency Contacts</a><a href="tel:117">DMC 117</a><a href="tel:1990">Ambulance 1990</a></div>
          <div><strong>Account</strong><Link to="/login">Login</Link><Link to="/register">Register</Link></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} DGNV Government Platform</span><span>Sri Lanka</span></div>
      </footer>
    </div>
  );
};

export default Home;
