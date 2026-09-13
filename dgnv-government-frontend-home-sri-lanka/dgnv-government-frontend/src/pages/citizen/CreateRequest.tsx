import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import { createRequest, getCitizens } from "../../services/platformApi";
import type { CitizenProfile } from "../../types/platform";
import { findCitizenByEmail } from "../../utils/profile";
import { getEmail } from "../../utils/session";

const CreateRequest = () => {
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contactNumber: "",
    whatsappNumber: "",
    district: "",
    dsDivision: "",
    gsDivision: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const citizens = await getCitizens();
        const citizen = findCitizenByEmail(citizens, getEmail());
        setProfile(citizen || null);

        if (citizen) {
          setFormData((current) => ({
            ...current,
            district: citizen.district || "",
            dsDivision: citizen.dsDivision || "",
            gsDivision: citizen.gsDivision || "",
          }));
        }
      } catch {
        setError("Unable to load your citizen profile.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!profile) {
      setError("Citizen profile is required before creating requests.");
      return;
    }

    try {
      await createRequest({
        ...formData,
        citizenId: profile.userId,
      });
      setMessage("Request submitted successfully.");
      setFormData({
        title: "",
        description: "",
        contactNumber: "",
        whatsappNumber: "",
        district: profile.district || "",
        dsDivision: profile.dsDivision || "",
        gsDivision: profile.gsDivision || "",
      });
    } catch {
      setError("Request submission failed.");
    }
  };

  return (
    <DashboardLayout role="CITIZEN">
      <PageHeader
        eyebrow="Citizen Request"
        title="Create Request"
      description="Submitted requests enter the backend workflow and are auto-assigned when a matching officer exists."
    />

    <div className="glass-card form-panel">
      {loading ? <LoadingSpinner /> : null}
      {message ? <div className="alert alert-success">{message}</div> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

        {!loading ? (
          <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {[
              ["title", "Title", "text"],
              ["contactNumber", "Contact Number", "tel"],
              ["whatsappNumber", "WhatsApp Number", "tel"],
              ["district", "District", "text"],
              ["dsDivision", "DS Division", "text"],
              ["gsDivision", "GS Division", "text"],
            ].map(([name, label, type]) => (
              <div className="col-md-6" key={name}>
                <label className="form-label">{label}</label>
                <input
                  className="form-control"
                  name={name}
                  type={type}
                  value={formData[name as keyof typeof formData]}
                  onChange={(event) =>
                    setFormData({ ...formData, [event.target.name]: event.target.value })
                  }
                  required
                />
              </div>
            ))}

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={5}
                name="description"
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
                required
              />
            </div>
          </div>

          <button className="btn btn-primary mt-4" type="submit" disabled={!profile}>
            Submit Request
          </button>
        </form>
        ) : null}
      </div>
  </DashboardLayout>
  );
};

export default CreateRequest;
