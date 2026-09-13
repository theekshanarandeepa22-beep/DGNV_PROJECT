import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  disableOfficer,
  getOfficers,
  updateOfficer,
} from "../../services/platformApi";
import type { OfficerProfile } from "../../types/platform";

const pageSize = 8;

const OfficerList = () => {
  const [officers, setOfficers] = useState<OfficerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [page, setPage] = useState(1);
  const [editOfficer, setEditOfficer] = useState<OfficerProfile | null>(null);
  const [disableTarget, setDisableTarget] = useState<OfficerProfile | null>(null);
  const [message, setMessage] = useState("");

  const loadOfficers = async () => {
    setLoading(true);
    const data = await getOfficers();
    setOfficers(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadOfficers();
  }, []);

  const districts = useMemo(
    () => Array.from(new Set(officers.map((officer) => officer.district).filter(Boolean))),
    [officers]
  );

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return officers.filter((officer) => {
      const matchesSearch =
        officer.fullName.toLowerCase().includes(query) ||
        officer.email.toLowerCase().includes(query) ||
        officer.nicNumber.toLowerCase().includes(query);

      const matchesDistrict = district ? officer.district === district : true;
      return matchesSearch && matchesDistrict;
    });
  }, [district, officers, search]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  const confirmDisable = async () => {
    if (!disableTarget) {
      return;
    }

    const response = await disableOfficer(disableTarget.id);
    setMessage(response);
    setDisableTarget(null);
    await loadOfficers();
  };

  const saveEdit = async () => {
    if (!editOfficer) {
      return;
    }

    await updateOfficer(editOfficer.id, editOfficer);
    setMessage("Officer updated successfully.");
    setEditOfficer(null);
    await loadOfficers();
  };

  return (
    <DashboardLayout role="ADMIN">
      <PageHeader
        eyebrow="Officer Administration"
        title="View Officers"
        description="Search, filter, edit, and disable officer profiles from the user service."
      />

      {message ? <div className="alert alert-success">{message}</div> : null}

      <div className="glass-card mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <input
              className="form-control"
              placeholder="Search by officer name, email, or NIC"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={district}
              onChange={(event) => {
                setDistrict(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All districts</option>
              {districts.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <DataTable
            emptyText="No officers found."
            data={paginated}
            columns={[
              { header: "Officer Name", render: (row) => row.fullName },
              { header: "Email", render: (row) => row.email },
              { header: "NIC Number", render: (row) => row.nicNumber },
              { header: "District", render: (row) => row.district },
              { header: "DS Division", render: (row) => row.dsDivision },
              { header: "GS Division", render: (row) => row.gsDivision },
              {
                header: "Status",
                render: (row) => (
                  <span className={`badge text-bg-${row.active ? "success" : "secondary"}`}>
                    {row.active ? "Active" : "Disabled"}
                  </span>
                ),
              },
              {
                header: "Actions",
                render: (row) => (
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setEditOfficer(row)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={!row.active}
                      onClick={() => setDisableTarget(row)}
                    >
                      Disable
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" disabled>
                      Reset Password
                    </button>
                  </div>
                ),
              },
            ]}
          />

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted">Page {page} of {pageCount}</span>
            <div className="btn-group">
              <button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <button className="btn btn-outline-primary" disabled={page === pageCount} onClick={() => setPage(page + 1)}>
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {disableTarget ? (
        <ConfirmModal
          title="Disable Officer"
          message={`Disable ${disableTarget.fullName}? This calls the existing officer disable endpoint.`}
          confirmText="Disable"
          onCancel={() => setDisableTarget(null)}
          onConfirm={confirmDisable}
        />
      ) : null}

      {editOfficer ? (
        <div className="modal-backdrop-custom">
          <div className="glass-card edit-modal">
            <h2>Edit Officer</h2>
            <div className="row g-3 mt-2">
              {["fullName", "email", "nicNumber", "district", "dsDivision", "gsDivision"].map((field) => (
                <div className="col-md-6" key={field}>
                  <label className="form-label">{field}</label>
                  <input
                    className="form-control"
                    value={String(editOfficer[field as keyof OfficerProfile] || "")}
                    onChange={(event) =>
                      setEditOfficer({
                        ...editOfficer,
                        [field]: event.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="btn btn-outline-secondary" onClick={() => setEditOfficer(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default OfficerList;
