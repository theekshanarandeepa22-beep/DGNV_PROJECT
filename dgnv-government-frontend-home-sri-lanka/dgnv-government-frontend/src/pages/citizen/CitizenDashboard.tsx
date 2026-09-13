import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaClock, FaFileAlt, FaListAlt } from "react-icons/fa";
import DataTable from "../../components/common/DataTable";
import DashboardCard from "../../components/common/DashboardCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getCitizens,
  getRequestsByCitizen,
} from "../../services/platformApi";
import type { CitizenProfile, DisasterRequest } from "../../types/platform";
import { getEmail } from "../../utils/session";
import { findCitizenByEmail } from "../../utils/profile";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDate } from "../../utils/status";

const CitizenDashboard = () => {
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [requests, setRequests] = useState<DisasterRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const citizens = await getCitizens();
        const citizen = findCitizenByEmail(citizens, getEmail());
        setProfile(citizen || null);

        if (citizen) {
          setRequests(await getRequestsByCitizen(citizen.userId));
        }
      } catch {
        setError("Unable to load your request data from the request service.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const count = (status: string) =>
    requests.filter((request) => request.status === status).length;

  return (
    <DashboardLayout role="CITIZEN">
      <PageHeader
        eyebrow="Citizen Services"
        title="Citizen Dashboard"
        description="Create requests and follow progress through the active government workflow."
      />

      {loading ? <LoadingSpinner /> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      {!loading && !profile ? (
        <div className="alert alert-warning">
          Citizen profile was not found for the logged-in email.
        </div>
      ) : null}

      {!loading ? (
        <div className="metric-grid">
          <DashboardCard title="Total Requests" value={requests.length} icon={FaListAlt} />
          <DashboardCard title="Pending Requests" value={count("PENDING")} icon={FaClock} tone="warning" />
          <DashboardCard title="Approved Requests" value={count("APPROVED")} icon={FaCheckCircle} tone="success" />
          <DashboardCard title="Completed Requests" value={count("COMPLETED")} icon={FaFileAlt} />
        </div>
      ) : null}

      {!loading ? (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="section-title mb-0">My Requests</h2>
            <Link className="btn btn-primary" to="/citizen/requests/new">
              Create Request
            </Link>
          </div>
          <DataTable
            emptyText="No requests found for your profile."
            data={requests}
            columns={[
              { header: "Request ID", render: (row) => `#${row.id}` },
              { header: "Title", render: (row) => row.title },
              { header: "Category", render: (row) => row.category || "Unreviewed" },
              { header: "Priority", render: (row) => row.priority || "Not set" },
              { header: "Status", render: (row) => <StatusBadge status={row.status} /> },
              { header: "Created Date", render: (row) => formatDate(row.createdAt) },
            ]}
          />
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default CitizenDashboard;
