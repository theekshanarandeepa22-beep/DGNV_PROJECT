import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import { changePassword } from "../../services/authService";
import { getEmail } from "../../utils/session";

const Settings = () => {
  const email = getEmail();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Your login session does not contain an email address.");
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    try {
      setLoading(true);
      const response = await changePassword({
        email,
        oldPassword,
        newPassword,
      });

      setMessage(
        typeof response === "string"
          ? response
          : "Password changed successfully."
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const backendMessage = err?.response?.data;
      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : "Unable to change password. Check your current password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        description="Manage your administrator account settings."
      />

      <Card className="glass-card form-panel border-0">
        <Card.Body className="p-4 p-md-5">
          <div className="section-heading">
            <h2>Change Password</h2>
            <p>Update the password for your administrator account.</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group controlId="adminEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" value={email} readOnly />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group controlId="currentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter current password"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Change Password"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
};

export default Settings;
