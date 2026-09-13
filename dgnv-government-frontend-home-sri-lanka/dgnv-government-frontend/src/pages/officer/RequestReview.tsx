import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  approveRequest,
  getCitizenById,
  getOfficerById,
  getRequest,
  getRequestCategories,
  getRequestHistory,
  getRequestPriorities,
  rejectRequest,
  reviewRequest,
  searchMatchingOfficers,
} from "../../services/platformApi";
import {
  forwardRequestToNgo,
  getIntegrationLogs,
  getRequestTracking,
  type IntegrationLog,
  type RequestTracking,
} from "../../services/integrationApi";
import type { CitizenProfile, DisasterRequest, OfficerProfile } from "../../types/platform";
import type { RequestHistory } from "../../services/platformApi";

const RequestReview = () => {
  const { id } = useParams();
  const [request, setRequest] = useState<DisasterRequest | null>(null);
  const [citizen, setCitizen] = useState<CitizenProfile | null>(null);
  const [claimedOfficer, setClaimedOfficer] = useState<OfficerProfile | null>(null);
  const [matchingOfficers, setMatchingOfficers] = useState<OfficerProfile[]>([]);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [tracking, setTracking] = useState<RequestTracking | null>(null);
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    officerNote: "",
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    if (!id) return;

    setLoading(true);
    setError("");
    try {
      const [requestData, categoryData, priorityData, historyData] = await Promise.all([
        getRequest(id),
        getRequestCategories(),
        getRequestPriorities(),
        getRequestHistory(id),
      ]);

      setRequest(requestData);
      setCategories(categoryData);
      setPriorities(priorityData);
      setHistory(historyData);
      setFormData({
        category: requestData.category || categoryData[0] || "",
        priority: requestData.priority || priorityData[0] || "",
        officerNote: requestData.officerNote || "",
      });

      const [citizenData, officerData, matchingData] = await Promise.all([
        requestData.citizenId ? getCitizenById(requestData.citizenId) : Promise.resolve(null),
        requestData.claimedByOfficerId ? getOfficerById(requestData.claimedByOfficerId) : Promise.resolve(null),
        searchMatchingOfficers({
          district: requestData.district || "",
          dsDivision: requestData.dsDivision || "",
          gsDivision: requestData.gsDivision || "",
        }),
      ]);

      setCitizen(citizenData);
      setClaimedOfficer(officerData);
      setMatchingOfficers(matchingData);

      try {
        setTracking(await getRequestTracking(id));
      } catch {
        setTracking(null);
      }

      try {
        setLogs(await getIntegrationLogs(id));
      } catch {
        setLogs([]);
      }
    } catch {
      setError("Unable to load request review data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const saveReview = async () => {
    if (!id) return;
    const updated = await reviewRequest(id, formData);
    setRequest(updated);
    setHistory(await getRequestHistory(id));
    setMessage("Review details saved.");
  };

  const performAction = async (action: "approve" | "reject" | "ngo") => {
    if (!id) return;
    setActionLoading(true);
    setError("");
    setMessage("");

    try {
      await saveReview();

      if (action === "approve") {
        await approveRequest(id);
        setMessage("Request approved successfully.");
      } else if (action === "reject") {
        await rejectRequest(id);
        setMessage("Request rejected successfully.");
      } else {
        // The integration service forwards an APPROVED request to the NGO service.
        await forwardRequestToNgo(id);
        setMessage("Request forwarded to the NGO service successfully.");
      }

      await load();
    } catch (err) {
      console.error(err);
      setError("The requested action failed. Check the service logs and request status.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout role="OFFICER">
      <PageHeader
        eyebrow="Request Review"
        title={`Review Request ${id ? `#${id}` : ""}`}
        description="Request, officer, history, and NGO integration data are loaded from the backend services."
      />

      {loading ? <LoadingSpinner /> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {message ? <div className="alert alert-success">{message}</div> : null}

      {!loading && request ? (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="glass-card">
              <h2 className="section-title">Request Details</h2>
              <Detail label="Title" value={request.title} />
              <Detail label="Description" value={request.description || "-"} />
              <Detail label="Contact Number" value={request.contactNumber || "-"} />
              <Detail label="WhatsApp Number" value={request.whatsappNumber || "-"} />
              <Detail label="Status" value={<StatusBadge status={request.status} />} />
              <Detail label="Category" value={request.category || "-"} />
              <Detail label="Priority" value={request.priority || "-"} />
            </div>
          </div>

          <div className="col-lg-5">
            <div className="glass-card mb-4">
              <h2 className="section-title">Citizen & Location</h2>
              <Detail label="Citizen Name" value={citizen?.fullName || "Unknown"} />
              <Detail label="Email" value={citizen?.email || "-"} />
              <Detail label="District" value={request.district || "-"} />
              <Detail label="DS Division" value={request.dsDivision || "-"} />
              <Detail label="GS Division" value={request.gsDivision || "-"} />
            </div>

            <div className="glass-card">
              <h2 className="section-title">Assigned Officer</h2>
              <Detail label="Name" value={claimedOfficer?.fullName || "Not assigned"} />
              <Detail label="Email" value={claimedOfficer?.email || "-"} />
              <Detail label="Officer ID" value={claimedOfficer?.userId || "-"} />
              <div className="mt-3">
                <strong>Matching Officers</strong>
                {matchingOfficers.length === 0 ? (
                  <p className="text-muted mb-0 mt-2">No matching officers found.</p>
                ) : (
                  <ul className="mt-2 mb-0">
                    {matchingOfficers.map((officer) => (
                      <li key={officer.id}>{officer.fullName} ({officer.email})</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="glass-card form-panel">
              <h2 className="section-title">Officer Inputs</h2>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(event) => setFormData({ ...formData, priority: event.target.value })}
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={formData.officerNote}
                    onChange={(event) => setFormData({ ...formData, officerNote: event.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button className="btn btn-outline-primary" onClick={() => void saveReview()} disabled={actionLoading}>
                  Save Review
                </button>
                <button className="btn btn-success" onClick={() => void performAction("approve")} disabled={actionLoading}>
                  Approve
                </button>
                <button className="btn btn-danger" onClick={() => void performAction("reject")} disabled={actionLoading}>
                  Reject
                </button>
                <button
                  className="btn btn-info text-white"
                  onClick={() => void performAction("ngo")}
                  disabled={actionLoading || request.status !== "APPROVED"}
                >
                  Send To NGO
                </button>
              </div>
              {request.status !== "APPROVED" ? (
                <small className="text-muted d-block mt-2">Approve the request before sending it to the NGO service.</small>
              ) : null}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="glass-card">
              <h2 className="section-title">Request History</h2>
              {history.length === 0 ? <p className="text-muted">No history found.</p> : (
                <div className="stat-list">
                  {history.map((item) => (
                    <div className="d-flex justify-content-between border-bottom py-2" key={item.id}>
                      <span>{item.action}</span>
                      <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="glass-card">
              <h2 className="section-title">NGO Tracking</h2>
              {tracking ? (
                <>
                  <Detail label="NGO" value={tracking.ngoName || "-"} />
                  <Detail label="Volunteer" value={tracking.volunteerName || "-"} />
                  <Detail label="Volunteer Phone" value={tracking.volunteerPhone || "-"} />
                  <Detail label="Volunteer WhatsApp" value={tracking.volunteerWhatsapp || "-"} />
                  <Detail label="Status" value={tracking.status} />
                  <Detail label="Updated" value={tracking.updatedAt ? new Date(tracking.updatedAt).toLocaleString() : "-"} />
                </>
              ) : (
                <p className="text-muted">No NGO tracking record exists yet.</p>
              )}

              <h3 className="h6 mt-4">Integration Logs</h3>
              {logs.length === 0 ? <p className="text-muted">No integration logs found.</p> : (
                <div className="stat-list">
                  {logs.map((log) => (
                    <div className="border-bottom py-2" key={log.id}>
                      <div className="d-flex justify-content-between">
                        <strong>{log.action}</strong>
                        <span>{log.status}</span>
                      </div>
                      <small className="text-muted">{log.message}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

type DetailProps = {
  label: string;
  value: React.ReactNode;
};

const Detail = ({ label, value }: DetailProps) => (
  <div className="detail-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default RequestReview;
