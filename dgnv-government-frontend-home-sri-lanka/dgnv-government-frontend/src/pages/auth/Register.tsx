import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    district: "",
    dsDivision: "",
    gsDivision: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await api.post<string>("/auth/register", formData);
      setMessage(response.data);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        district: "",
        dsDivision: "",
        gsDivision: "",
      });
    } catch {
      setError("Citizen registration failed. Please verify the platform services are running.");
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">
        <span className="eyebrow">Citizen Portal</span>
        <h1>Create Citizen Account</h1>
        <p className="mb-4">
          Registration creates records in auth and citizen profile services.
        </p>

        {message ? <div className="alert alert-success">{message}</div> : null}
        {error ? <div className="alert alert-danger">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {[
              ["fullName", "Full Name", "text"],
              ["email", "Email", "email"],
              ["password", "Password", "password"],
              ["district", "District", "text"],
              ["dsDivision", "DS Division", "text"],
              ["gsDivision", "GS Division", "text"],
            ].map(([name, label, type]) => (
              <div className="col-md-6" key={name}>
                <label className="form-label">{label}</label>
                <input
                  className="form-control"
                  type={type}
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <button className="btn btn-primary w-100 mt-4" type="submit">
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login">Already registered? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
