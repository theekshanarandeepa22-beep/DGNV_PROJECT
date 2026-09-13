import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getCitizenById,
  getCitizens,
  updateCitizen,
} from "../../services/platformApi";
import type { CitizenProfile } from "../../types/platform";
import { findCitizenByEmail } from "../../utils/profile";
import { getEmail } from "../../utils/session";

const CitizenProfilePage = () => {
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const citizens = await getCitizens();
      const citizen = findCitizenByEmail(citizens, getEmail());
      setProfile(citizen ? await getCitizenById(citizen.id) : null);
    };

    void load();
  }, []);

  const save = async () => {
    if (!profile) {
      return;
    }

    const updated = await updateCitizen(profile.id, profile);
    setProfile(updated);
    setMessage("Profile updated successfully.");
  };

  return (
    <DashboardLayout role="CITIZEN">
      <PageHeader
        eyebrow="Citizen Profile"
        title="Update Profile"
        description="Updates the existing citizen profile record."
      />

      <div className="glass-card form-panel">
        {message ? <div className="alert alert-success">{message}</div> : null}

        {!profile ? (
          <div className="alert alert-warning">Citizen profile was not found.</div>
        ) : (
          <div className="row g-3">
            {["fullName", "email", "district", "dsDivision", "gsDivision"].map((field) => (
              <div className="col-md-6" key={field}>
                <label className="form-label">{field}</label>
                <input
                  className="form-control"
                  value={String(profile[field as keyof CitizenProfile] || "")}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      [field]: event.target.value,
                    })
                  }
                />
              </div>
            ))}
            <div className="col-12">
              <button className="btn btn-primary" onClick={save}>
                Save Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CitizenProfilePage;
