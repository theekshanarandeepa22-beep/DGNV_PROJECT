import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getApprovedCount,
  getClaimedCount,
  getNgoCount,
  getPendingCount,
  getRejectedCount,
} from "../../services/platformApi";

const Reports = () => {
  const [counts, setCounts] = useState({
    pending: 0,
    claimed: 0,
    approved: 0,
    rejected: 0,
    ngo: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [pending, claimed, approved, rejected, ngo] = await Promise.all([
          getPendingCount(),
          getClaimedCount(),
          getApprovedCount(),
          getRejectedCount(),
          getNgoCount(),
        ]);
        setCounts({ pending, claimed, approved, rejected, ngo });
      } catch {
        setError("Unable to load request statistics.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const rows = [
    ["PENDING", counts.pending],
    ["CLAIMED", counts.claimed],
    ["APPROVED", counts.approved],
    ["REJECTED", counts.rejected],
    ["SENT_TO_NGO", counts.ngo],
  ] as const;

  return (
    <DashboardLayout role="ADMIN">
      <PageHeader
        eyebrow="Reports"
        title="Request Reports"
        description="Live status counts are loaded from the request-service statistics endpoints."
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="glass-card">
        <h2 className="section-title">Status Summary</h2>
        {loading ? (
          <p className="text-muted">Loading statistics...</p>
        ) : (
          <div className="stat-list">
            {rows.map(([status, count]) => (
              <div className="d-flex justify-content-between border-bottom py-2" key={status}>
                <span>{status}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
