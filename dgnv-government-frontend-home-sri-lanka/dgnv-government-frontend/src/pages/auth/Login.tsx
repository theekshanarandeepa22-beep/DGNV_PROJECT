import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "CITIZEN",
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    try {
      const response = await loginUser(
        formData.email,
        formData.password
      );

      console.log(response);

      if (!response.token) {
        alert(response.role);
        return;
      }

      if (formData.role !== response.role) {
        alert(`Invalid portal selection. This account belongs to the ${response.role} portal.`);
        return;
      }

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "role",
        response.role
      );

      localStorage.setItem(
        "email",
        formData.email
      );

      if (response.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (
        response.role === "OFFICER"
      ) {
        navigate("/officer/dashboard");
      } else {
        navigate("/citizen/dashboard");
      }

    } catch (error) {
      console.error(error);
      alert("Login Failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0d47a1,#1565c0,#42a5f5)",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "450px",
          borderRadius: "20px",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">
              DGNV Login
            </h2>

            <p className="text-muted">
              Disaster Governance Platform
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Portal
              </label>

              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="CITIZEN">
                  Citizen
                </option>

                <option value="OFFICER">
                  Officer
                </option>

                <option value="ADMIN">
                  Admin
                </option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Password
              </label>

              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">
              Don't have an account?
            </span>

            <br />

            <Link
              to="/register"
              className="text-decoration-none fw-semibold"
            >
              Create New Account
            </Link>
          </div>

          <div className="text-center mt-3">
            <Link
              to="/"
              className="text-decoration-none"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
