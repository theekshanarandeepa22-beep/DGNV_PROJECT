import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  claimRequest,
  getCitizens,
  getOfficers,
  getPendingRequests,
  getRequestsByOfficer,
} from "../../services/platformApi";
import type { CitizenProfile, DisasterRequest, OfficerProfile } from "../../types/platform";
import { findOfficerByEmail } from "../../utils/profile";
import { getEmail } from "../../utils/session";

const OfficerRequests = () => {
  const [requests, setRequests] = useState<DisasterRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<DisasterRequest[]>([]);
  const [citizens, setCitizens] = useState<CitizenProfile[]>([]);
  const [officer, setOfficer] = useState<OfficerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setError("");
      const [officers, citizenData, pending] = await Promise.all([
        getOfficers(),
        getCitizens(),
        getPendingRequests(),
      ]);
      const currentOfficer = findOfficerByEmail(officers, getEmail());
      setOfficer(currentOfficer || null);
      setCitizens(citizenData);
      setPendingRequests(pending);

      if (currentOfficer) {
        setRequests(await getRequestsByOfficer(currentOfficer.userId));
      } else {
        setRequests([]);
      }
    } catch {
      setError("Unable to load assigned or pending requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const citizenName = (userId?: number) =>
    citizens.find((citizen) => citizen.userId === userId)?.fullName || "Unknown";

  const claim = async (requestId: number) => {
    if (!officer) return;
    try {
      await claimRequest(requestId, officer.userId);
      setMessage(`Request #${requestId} claimed successfully.`);
      await load();
    } catch {
      setError("Unable to claim this request. It may already be claimed.");
    }
  };

  return (
    <DashboardLayout role="OFFICER">
      <PageHeader
        eyebrow="Assigned Requests"
        title="Officer Request Table"
        description="Assigned requests are loaded by officer ID. Pending requests can be claimed when they are available."
      />

      {loading ? <LoadingSpinner /> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {message ? <div className="alert alert-success">{message}</div> : null}

      {!loading && pendingRequests.length > 0 ? (
        <div className="glass-card mb-4">
          <h2 className="section-title">Pending Requests Available To Claim</h2>
          <DataTable
            emptyText="No pending requests found."
            data={pendingRequests}
            columns={[
              { header: "Request ID", render: (row) => `#${row.id}` },
              { header: "Citizen", render: (row) => citizenName(row.citizenId) },
              { header: "District", render: (row) => row.district || "-" },
              { header: "DS Division", render: (row) => row.dsDivision || "-" },
              { header: "GS Division", render: (row) => row.gsDivision || "-" },
              {
                header: "Action",
                render: (row) => (
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={!officer}
                    onClick={() => void claim(row.id)}
                  >
                    Claim
                  </button>
                ),
              },
            ]}
          />
        </div>
      ) : null}

      {!loading ? (
        <DataTable
          emptyText="No assigned requests found."
          data={requests}
          columns={[
            { header: "Request ID", render: (row) => `#${row.id}` },
            { header: "Citizen Name", render: (row) => citizenName(row.citizenId) },
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
      ) : null}
    </DashboardLayout>
  );
};

export default OfficerRequests;
