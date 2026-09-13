let selectedRequest = null;

document.addEventListener("DOMContentLoaded", async () => {
  setupAuthenticatedLayout();
  document.getElementById("assignVolunteerBtn")?.addEventListener("click", assignVolunteer);
  await loadRequestDetails();
});

async function loadRequestDetails() {
  const requestId = getQueryParam("id");
  if (!requestId) {
    showToast("Request id is missing", "danger");
    return;
  }

  showSpinner();
  try {
    const [requestsRes, volunteersRes] = await Promise.all([
      api.getRequests(),
      api.getAvailableVolunteers()
    ]);
    const requests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
    selectedRequest = requests.find((item) => String(item.id) === String(requestId));
    if (!selectedRequest) {
      showToast("Request was not found", "danger");
      return;
    }

    renderDetails(selectedRequest);
    renderVolunteerDropdown(Array.isArray(volunteersRes.data) ? volunteersRes.data : []);
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    hideSpinner();
  }
}

function renderDetails(request) {
  document.getElementById("detailTitle").textContent = `Request #${request.id}`;
  document.getElementById("detailStatus").innerHTML = statusBadge(request.status);
  const container = document.getElementById("detailsGrid");
  container.innerHTML = [
    ["Government Request ID", request.government_request_id],
    ["Citizen", request.citizen_name || request.citizen_id],
    ["Title", request.title],
    ["Category", request.category],
    ["Priority", request.priority],
    ["District", request.district],
    ["DS Division", request.ds_division],
    ["GS Division", request.gs_division],
    ["Contact Number", request.contact_number],
    ["WhatsApp Number", request.whatsapp_number],
    ["Description", request.description],
    ["Status", normalizeStatus(request.status)]
  ].map(([label, value]) => `
    <div class="detail-item">
      <div class="detail-label">${escapeHtml(label)}</div>
      <div class="detail-value">${escapeHtml(valueOrDash(value))}</div>
    </div>
  `).join("");
}

function renderVolunteerDropdown(volunteers) {
  const select = document.getElementById("volunteerSelect");
  if (!select) return;
  if (!volunteers.length) {
    select.innerHTML = `<option value="">No available volunteers found</option>`;
    return;
  }
  select.innerHTML = volunteers.map((volunteer) => `
    <option value="${volunteer.id}">
      ${escapeHtml(volunteer.full_name || volunteer.email || `Volunteer ${volunteer.id}`)}
      - ${escapeHtml(volunteer.gs_division || volunteer.ds_division || volunteer.district || "Area not set")}
    </option>
  `).join("");
}

async function assignVolunteer() {
  if (!selectedRequest) return;
  if (!confirmAction("Assign the best available volunteer to this request?")) return;

  showSpinner();
  try {
    const response = await api.assignVolunteer(selectedRequest.id);
    showToast(response.data?.message || "Volunteer assigned successfully", "success");
    if (response.data?.volunteer) {
      document.getElementById("assignedVolunteer").innerHTML = `
        <div class="alert alert-success mb-0">
          <strong>${escapeHtml(response.data.volunteer.full_name || "Volunteer assigned")}</strong><br>
          ${escapeHtml(valueOrDash(response.data.volunteer.phone))}
        </div>
      `;
    }
    await loadRequestDetails();
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    hideSpinner();
  }
}
