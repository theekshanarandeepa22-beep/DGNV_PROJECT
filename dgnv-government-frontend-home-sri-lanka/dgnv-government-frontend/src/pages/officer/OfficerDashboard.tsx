import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { FaCheckCircle, FaClock, FaListAlt, FaTimesCircle } from "react-icons/fa";
import DashboardCard from "../../components/common/DashboardCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getOfficers,
  getRequestsByOfficer,
} from "../../services/platformApi";
import type { DisasterRequest, OfficerProfile } from "../../types/platform";
import { findOfficerByEmail } from "../../utils/profile";
import { getEmail } from "../../utils/session";
import StatusBadge from "../../components/common/StatusBadge";

const OfficerDashboard = () => {
  const [profile, setProfile] = useState<OfficerProfile | null>(null);
  const [requests, setRequests] = useState<DisasterRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const officers = await getOfficers();
        const officer = findOfficerByEmail(officers, getEmail());
        setProfile(officer || null);

        if (officer) {
          setRequests(await getRequestsByOfficer(officer.userId));
        }
      } catch {
        setError("Unable to load assigned requests from the request service.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const count = (status: string) =>
    requests.filter((request) => request.status === status).length;

  return (
    <DashboardLayout role="OFFICER">
      <PageHeader
        eyebrow="Officer Workspace"
        title="Officer Dashboard"
        description="Review and process requests assigned by the request service."
      />

      {loading ? <LoadingSpinner /> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      {!loading && !profile ? (
        <div className="alert alert-warning">
          Officer profile was not found for the logged-in email.
        </div>
      ) : null}

      {!loading ? (
        <div className="metric-grid">
          <DashboardCard title="Assigned Requests" value={requests.length} icon={FaListAlt} />
          <DashboardCard title="Pending Reviews" value={count("CLAIMED")} icon={FaClock} tone="warning" />
          <DashboardCard title="Approved Requests" value={count("APPROVED")} icon={FaCheckCircle} tone="success" />
          <DashboardCard title="Rejected Requests" value={count("REJECTED")} icon={FaTimesCircle} tone="danger" />
        </div>
      ) : null}

      {!loading ? (
        <div className="mt-4">
          <DataTable
            emptyText="No assigned requests found."
            data={requests}
            columns={[
              { header: "Request ID", render: (row) => `#${row.id}` },
              { header: "Citizen", render: (row) => row.citizenId || "-" },
              { header: "District", render: (row) => row.district || "-" },
              { header: "DS Division", render: (row) => row.dsDivision || "-" },
              { header: "GS Division", render: (row) => row.gsDivision || "-" },
              { header: "Status", render: (row) => <StatusBadge status={row.status} /> },
              {
                header: "Actions",
                render: (row) => (
                  <Link className="btn btn-sm btn-primary" to={`/officer/requests/${row.id}`}>
                    Review
                  </Link>
                ),
              },
            ]}
          />
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default OfficerDashboard;
