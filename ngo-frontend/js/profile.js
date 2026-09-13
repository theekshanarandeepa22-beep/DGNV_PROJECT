document.addEventListener("DOMContentLoaded", () => {
  setupAuthenticatedLayout();
  renderProfile();
  document.getElementById("profileForm")?.addEventListener("submit", saveProfile);
  document.getElementById("passwordForm")?.addEventListener("submit", changePasswordUnavailable);
});

function renderProfile() {
  const session = getSession();
  const profile = getStoredProfile(session);

  setValue("profileName", profile.name);
  setValue("profileEmail", profile.email);
  setValue("profilePhone", profile.phone);
  setValue("profileDistrict", profile.district);
  setTextValue("profileRole", profile.role);
  setTextValue("profileLoginAt", formatDateTime(profile.loginAt));
}

function getStoredProfile(session) {
  const saved = JSON.parse(localStorage.getItem("dgnv_ngo_profile") || "{}");
  return {
    name: saved.name || "NGO Administrator",
    email: saved.email || session.email || "",
    phone: saved.phone || "",
    district: saved.district || "",
    role: session.role || "NGO_ADMIN",
    loginAt: session.loginAt
  };
}

function saveProfile(event) {
  event.preventDefault();
  const payload = {
    name: document.getElementById("profileName").value.trim(),
    email: document.getElementById("profileEmail").value.trim(),
    phone: document.getElementById("profilePhone").value.trim(),
    district: document.getElementById("profileDistrict").value.trim()
  };
  localStorage.setItem("dgnv_ngo_profile", JSON.stringify(payload));
  showToast("Profile saved locally. No verified backend profile update endpoint exists.", "success");
}

function changePasswordUnavailable(event) {
  event.preventDefault();
  showToast("Password change is not available because the backend has no verified change-password endpoint.", "warning");
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value || "";
}

function setTextValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = valueOrDash(value);
}
