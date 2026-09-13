import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaClock,
  FaHandsHelping,
  FaListAlt,
  FaTimesCircle,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import DashboardCard from "../../components/common/DashboardCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getCitizens,
  getDashboardSummary,
  getOfficers,
  getRequests,
} from "../../services/platformApi";
import type {
  CitizenProfile,
  DashboardSummary,
  DisasterRequest,
  OfficerProfile,
} from "../../types/platform";

const emptySummary: DashboardSummary = {
  totalRequests: 0,
  pending: 0,
  claimed: 0,
  approved: 0,
  rejected: 0,
  sentToNgo: 0,
};

const AdminDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [requests, setRequests] = useState<DisasterRequest[]>([]);
  const [officers, setOfficers] = useState<OfficerProfile[]>([]);
  const [citizens, setCitizens] = useState<CitizenProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryData, requestData, officerData, citizenData] =
          await Promise.all([
            getDashboardSummary(),
            getRequests(),
            getOfficers(),
            getCitizens(),
          ]);

        setSummary(summaryData);
        setRequests(requestData);
        setOfficers(officerData);
        setCitizens(citizenData);
      } catch {
        setError("Unable to load dashboard data from the platform services.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const districtStats = useMemo(() => {
    const counts = new Map<string, number>();
    requests.forEach((request) => {
      const district = request.district || "Unspecified";
      counts.set(district, (counts.get(district) || 0) + 1);
    });
    return Array.from(counts.entries());
  }, [requests]);

  const categoryStats = useMemo(() => {
    const counts = new Map<string, number>();
    requests.forEach((request) => {
      const category = request.category || "Unreviewed";
      counts.set(category, (counts.get(category) || 0) + 1);
    });
    return Array.from(counts.entries());
  }, [requests]);

  const completed = requests.filter((request) => request.status === "COMPLETED").length;

  return (
    <DashboardLayout role="ADMIN">
      <PageHeader
        eyebrow="Admin Command Center"
        title="Government Platform Dashboard"
        description="Live operational overview from the registered officers, citizens, and request services."
      />

      {loading ? <LoadingSpinner /> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      {!loading ? (
        <>
          <motion.div className="metric-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DashboardCard title="Total Requests" value={summary.totalRequests} icon={FaListAlt} />
            <DashboardCard title="Pending Requests" value={summary.pending} icon={FaClock} tone="warning" />
            <DashboardCard title="Approved Requests" value={summary.approved} icon={FaCheckCircle} tone="success" />
            <DashboardCard title="Rejected Requests" value={summary.rejected} icon={FaTimesCircle} tone="danger" />
            <DashboardCard title="Sent To NGO Requests" value={summary.sentToNgo} icon={FaHandsHelping} tone="info" />
            <DashboardCard title="Completed Requests" value={completed} icon={FaCheckCircle} />
            <DashboardCard title="Total Citizens" value={citizens.length} icon={FaUsers} />
            <DashboardCard title="Total Officers" value={officers.length} icon={FaUserShield} />
          </motion.div>

          <div className="row g-4 mt-1">
            <div className="col-lg-6">
              <StatPanel title="District Wise Statistics" rows={districtStats} total={requests.length} />
            </div>
            <div className="col-lg-6">
              <StatPanel title="Category Wise Statistics" rows={categoryStats} total={requests.length} />
            </div>
          </div>
        </>
      ) : null}
    </DashboardLayout>
  );
};

type StatPanelProps = {
  title: string;
  rows: [string, number][];
  total: number;
};

const StatPanel = ({ title, rows, total }: StatPanelProps) => (
  <div className="glass-card">
    <h2 className="section-title">{title}</h2>
    {rows.length === 0 ? (
      <p className="text-muted">No request data is available yet.</p>
    ) : (
      <div className="stat-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <div className="d-flex justify-content-between">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${total ? (value / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AdminDashboard;
