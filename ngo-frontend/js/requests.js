let allRequests = [];
let requestState = {
  page: 1,
  pageSize: 8,
  total: 0,
  search: ""
};

document.addEventListener("DOMContentLoaded", async () => {
  setupAuthenticatedLayout();
  document.getElementById("searchInput")?.addEventListener("input", (event) => {
    requestState.search = event.target.value.trim().toLowerCase();
    requestState.page = 1;
    renderRequests();
  });
  document.getElementById("refreshBtn")?.addEventListener("click", loadRequests);
  await loadRequests();
});

async function loadRequests() {
  showSpinner();
  try {
    const response = await api.getRequests();
    allRequests = Array.isArray(response.data) ? response.data : [];
    renderRequests();
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    hideSpinner();
  }
}

function renderRequests() {
  const body = document.getElementById("requestsBody");
  if (!body) return;

  const filtered = allRequests.filter((request) => {
    const haystack = [
      request.id,
      request.government_request_id,
      request.citizen_name,
      request.citizen_id,
      request.category,
      request.priority,
      request.district,
      request.ds_division,
      request.gs_division,
      request.status
    ].join(" ").toLowerCase();
    return haystack.includes(requestState.search);
  });

  requestState.total = filtered.length;
  const start = (requestState.page - 1) * requestState.pageSize;
  const pageRows = filtered.slice(start, start + requestState.pageSize);

  if (!pageRows.length) {
    body.innerHTML = `<tr><td colspan="9" class="empty-state">No requests match the current view</td></tr>`;
  } else {
    body.innerHTML = pageRows.map((request) => `
      <tr>
        <td>#${valueOrDash(request.id)}</td>
        <td>${escapeHtml(valueOrDash(request.citizen_name || request.citizen_id))}</td>
        <td>${escapeHtml(valueOrDash(request.category))}</td>
        <td>${priorityBadge(request.priority)}</td>
        <td>${escapeHtml(valueOrDash(request.district))}</td>
        <td>${escapeHtml(valueOrDash(request.ds_division))}</td>
        <td>${escapeHtml(valueOrDash(request.gs_division))}</td>
        <td>${statusBadge(request.status)}</td>
        <td>
          <a class="btn btn-sm btn-outline-primary" href="request-details.html?id=${request.id}">
            <i class="bi bi-eye"></i>
          </a>
        </td>
      </tr>
    `).join("");
  }

  document.getElementById("requestCount").textContent = `${filtered.length} request${filtered.length === 1 ? "" : "s"}`;
  renderPagination("requestsPagination", requestState, (page) => {
    requestState.page = page;
    renderRequests();
  });
}
