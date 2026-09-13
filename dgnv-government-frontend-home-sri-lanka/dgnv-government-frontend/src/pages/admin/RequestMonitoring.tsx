import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getRequests } from "../../services/platformApi";
import type { DisasterRequest } from "../../types/platform";
import { formatDate } from "../../utils/status";

const RequestMonitoring = () => {
  const [requests, setRequests] = useState<DisasterRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setRequests(await getRequests());
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <DashboardLayout role="ADMIN">
      <PageHeader
        eyebrow="Request Monitoring"
        title="Monitor Requests"
        description="All request records from the request service."
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          emptyText="No requests found."
          data={requests}
          columns={[
            { header: "Request ID", render: (row) => `#${row.id}` },
            { header: "Title", render: (row) => row.title },
            { header: "District", render: (row) => row.district || "-" },
            { header: "Category", render: (row) => row.category || "Unreviewed" },
            { header: "Priority", render: (row) => row.priority || "Not set" },
            { header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { header: "Created", render: (row) => formatDate(row.createdAt) },
          ]}
        />
      )}
    </DashboardLayout>
  );
};

export default RequestMonitoring;
