import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getCitizens,
  getRequestsByCitizen,
} from "../../services/platformApi";
import type { DisasterRequest } from "../../types/platform";
import { formatDate } from "../../utils/status";
import { findCitizenByEmail } from "../../utils/profile";
import { getEmail } from "../../utils/session";

const MyRequests = () => {
  const [requests, setRequests] = useState<DisasterRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const citizens = await getCitizens();
        const citizen = findCitizenByEmail(citizens, getEmail());

        if (citizen) {
          setRequests(await getRequestsByCitizen(citizen.userId));
        }
      } catch {
        setError("Unable to load your requests.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <DashboardLayout role="CITIZEN">
      <PageHeader
        eyebrow="Citizen Requests"
        title="My Requests"
        description="Request status is read directly from the request service."
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
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
      )}
    </DashboardLayout>
  );
};

export default MyRequests;
