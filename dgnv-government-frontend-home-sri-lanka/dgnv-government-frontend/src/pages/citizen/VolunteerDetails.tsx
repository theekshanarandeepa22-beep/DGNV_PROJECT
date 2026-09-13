import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";

const VolunteerDetails = () => (
  <DashboardLayout role="CITIZEN">
    <PageHeader
      eyebrow="NGO Assignment"
      title="Volunteer Details"
      description="Volunteer assignment is shown here when the NGO service exposes assignment data."
    />

    <div className="glass-card empty-feature">
      <h2>Volunteer details are not available yet</h2>
      <p>
        The current government backend exposes request review and Send To NGO
        status, but no volunteer assignment endpoint with volunteer name, phone,
        WhatsApp number, category, or task status. No mock volunteer data is
        displayed.
      </p>
    </div>
  </DashboardLayout>
);

export default VolunteerDetails;
