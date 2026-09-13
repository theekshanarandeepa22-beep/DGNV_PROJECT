import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import { registerOfficer } from "../../services/platformApi";

const RegisterOfficer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    nicNumber: "",
    district: "",
    dsDivision: "",
    gsDivision: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(formData.nicNumber)) {
      setError("Enter a valid NIC number.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await registerOfficer(formData);

      setMessage(response);
      navigate("/admin/officers");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        nicNumber: "",
        district: "",
        dsDivision: "",
        gsDivision: "",
      });
    } catch {
      setError("Officer registration failed. Please verify the backend services are running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <PageHeader
        eyebrow="Officer Administration"
        title="Register Officer"
        description="Creates the auth user and officer profile through the existing registration flow."
      />

      <div className="glass-card form-panel">
        {message ? <div className="alert alert-success">{message}</div> : null}
        {error ? <div className="alert alert-danger">{error}</div> : null}
          <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>

              <input
                type="text"
                name="fullName"
                className="form-control"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>

              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Password</label>

              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">NIC Number</label>
              <input
                type="text"
                name="nicNumber"
                className="form-control"
                value={formData.nicNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">District</label>
              <input
                type="text"
                name="district"
                className="form-control"
                value={formData.district}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">DS Division</label>
              <input
                type="text"
                name="dsDivision"
                className="form-control"
                value={formData.dsDivision}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">GS Division</label>
              <input
                type="text"
                name="gsDivision"
                className="form-control"
                value={formData.gsDivision}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={submitting}
            >
              {submitting ? "Registering..." : "Register Officer"}
            </button>
            </div>
          </div>
          </form>
      </div>
    </DashboardLayout>
  );
};

export default RegisterOfficer;
