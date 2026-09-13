import { useEffect, useState } from "react";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import { disableCitizen, getCitizens } from "../../services/platformApi";
import type { CitizenProfile } from "../../types/platform";

const CitizenList = () => {
  const [citizens, setCitizens] = useState<CitizenProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<CitizenProfile | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setCitizens(await getCitizens());
    } catch {
      setError("Unable to load citizens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const confirmDisable = async () => {
    if (!target) return;
    try {
      const response = await disableCitizen(target.id);
      setMessage(response);
      setTarget(null);
      await load();
    } catch {
      setError("Unable to disable citizen.");
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <PageHeader
        eyebrow="Citizen Administration"
        title="View Citizens"
        description="Citizen profiles are loaded from the user service. The disable action uses the existing citizen endpoint."
      />

      {message ? <div className="alert alert-success">{message}</div> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? <LoadingSpinner /> : (
        <DataTable
          emptyText="No citizens found."
          data={citizens}
          columns={[
            { header: "Name", render: (row) => row.fullName || "-" },
            { header: "Email", render: (row) => row.email || "-" },
            { header: "District", render: (row) => row.district || "-" },
            { header: "DS Division", render: (row) => row.dsDivision || "-" },
            { header: "GS Division", render: (row) => row.gsDivision || "-" },
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
                <button
                  className="btn btn-sm btn-outline-danger"
                  disabled={!row.active}
                  onClick={() => setTarget(row)}
                >
                  Disable
                </button>
              ),
            },
          ]}
        />
      )}

      {target ? (
        <ConfirmModal
          title="Disable Citizen"
          message={`Disable ${target.fullName || target.email || "this citizen"}?`}
          confirmText="Disable"
          onCancel={() => setTarget(null)}
          onConfirm={confirmDisable}
        />
      ) : null}
    </DashboardLayout>
  );
};

export default CitizenList;
