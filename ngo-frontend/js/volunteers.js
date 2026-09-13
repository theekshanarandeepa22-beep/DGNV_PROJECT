let allVolunteers = [];
let volunteerState = {
  page: 1,
  pageSize: 8,
  total: 0,
  search: ""
};

document.addEventListener("DOMContentLoaded", async () => {
  setupAuthenticatedLayout();
  document.getElementById("volunteerForm")?.addEventListener("submit", addVolunteer);
  document.getElementById("volunteerSearch")?.addEventListener("input", (event) => {
    volunteerState.search = event.target.value.trim().toLowerCase();
    volunteerState.page = 1;
    renderVolunteers();
  });
  document.getElementById("volunteerRefreshBtn")?.addEventListener("click", loadVolunteers);
  await loadVolunteers();
});

async function loadVolunteers() {
  showSpinner();
  try {
    const response = await api.getVolunteers();
    allVolunteers = Array.isArray(response.data) ? response.data : [];
    renderVolunteers();
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    hideSpinner();
  }
}

function renderVolunteers() {
  const body = document.getElementById("volunteersBody");
  if (!body) return;

  const filtered = allVolunteers.filter((volunteer) => {
    const haystack = [
      volunteer.id,
      volunteer.full_name,
      volunteer.email,
      volunteer.phone,
      volunteer.district,
      volunteer.ds_division,
      volunteer.gs_division,
      volunteer.availability
    ].join(" ").toLowerCase();
    return haystack.includes(volunteerState.search);
  });

  volunteerState.total = filtered.length;
  const start = (volunteerState.page - 1) * volunteerState.pageSize;
  const pageRows = filtered.slice(start, start + volunteerState.pageSize);

  if (!pageRows.length) {
    body.innerHTML = `<tr><td colspan="8" class="empty-state">No volunteers found</td></tr>`;
  } else {
    body.innerHTML = pageRows.map((volunteer) => `
      <tr>
        <td>#${valueOrDash(volunteer.id)}</td>
        <td>${escapeHtml(valueOrDash(volunteer.full_name))}</td>
        <td>${escapeHtml(valueOrDash(volunteer.email))}</td>
        <td>${escapeHtml(valueOrDash(volunteer.phone))}</td>
        <td>${escapeHtml(valueOrDash(volunteer.district))}</td>
        <td>${escapeHtml(valueOrDash(volunteer.ds_division))}</td>
        <td>${statusBadge(volunteer.availability || "AVAILABLE")}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary" data-unavailable="edit"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" data-unavailable="delete"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `).join("");
  }

  body.querySelectorAll("[data-unavailable]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("This action is not available because the backend has no verified edit/delete volunteer endpoint.", "warning");
    });
  });

  document.getElementById("volunteerCount").textContent = `${filtered.length} volunteer${filtered.length === 1 ? "" : "s"}`;
  renderPagination("volunteersPagination", volunteerState, (page) => {
    volunteerState.page = page;
    renderVolunteers();
  });
}

async function addVolunteer(event) {
  event.preventDefault();
  const form = event.currentTarget;
  let session = {};
  try { session = JSON.parse(localStorage.getItem("dgnv_ngo_user") || "{}"); } catch {}
  const ngoId = Number(session.ngoId || 0);
  if (!ngoId) {
    showToast("NGO identity is missing. Please log in again.", "danger");
    return;
  }

  const payload = {
    ngo_id: ngoId,
    full_name: form.full_name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    password: form.password.value,
    district: form.district.value.trim(),
    ds_division: form.ds_division.value.trim(),
    gs_division: form.gs_division.value.trim()
  };

  showSpinner();
  try {
    const response = await api.addVolunteer(payload);
    showToast(response.data?.message || "Volunteer added successfully", "success");
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById("volunteerModal"))?.hide();
    await loadVolunteers();
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    hideSpinner();
  }
}
