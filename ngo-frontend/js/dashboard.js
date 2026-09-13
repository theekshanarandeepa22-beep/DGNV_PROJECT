document.addEventListener("DOMContentLoaded", async () => {
  setupAuthenticatedLayout();
  await loadDashboard();
});

async function loadDashboard() {
  showSpinner();
  try {
    const [summaryRes, requestsRes, tasksRes, volunteersRes] = await Promise.all([
      api.getDashboardSummary(),
      api.getRequests(),
      api.getTasks(),
      api.getVolunteers()
    ]);

    const summary = summaryRes.data || {};
    const requests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
    const tasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
    const volunteers = Array.isArray(volunteersRes.data) ? volunteersRes.data : [];

    const pendingRequests = requests.filter((item) =>
      String(item.status || "").toUpperCase().includes("RECEIVED")
    ).length;
    const assignedTasks = tasks.filter((item) =>
      String(item.status || "").toUpperCase() !== "COMPLETED"
    ).length;
    const availableVolunteers = volunteers.filter((item) =>
      String(item.availability || "AVAILABLE").toUpperCase() === "AVAILABLE"
    ).length;

    setText("totalRequests", summary.totalRequests ?? requests.length);
    setText("pendingRequests", pendingRequests);
    setText("assignedTasks", assignedTasks);
    setText("completedTasks", summary.completedTasks ?? tasks.filter((t) => t.status === "COMPLETED").length);
    setText("availableVolunteers", availableVolunteers);
    setText("busyVolunteers", Math.max(volunteers.length - availableVolunteers, 0));

    renderRecentRequests(requests.slice(-5).reverse());
    renderRecentTasks(tasks.slice(-5).reverse());
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    hideSpinner();
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function renderRecentRequests(requests) {
  const body = document.getElementById("recentRequestsBody");
  if (!body) return;
  if (!requests.length) {
    body.innerHTML = `<tr><td colspan="5" class="empty-state">No requests found</td></tr>`;
    return;
  }
  body.innerHTML = requests.map((request) => `
    <tr>
      <td>#${valueOrDash(request.id)}</td>
      <td>${escapeHtml(valueOrDash(request.category))}</td>
      <td>${priorityBadge(request.priority)}</td>
      <td>${statusBadge(request.status)}</td>
      <td><a class="btn btn-sm btn-outline-primary" href="request-details.html?id=${request.id}">Open</a></td>
    </tr>
  `).join("");
}

function renderRecentTasks(tasks) {
  const body = document.getElementById("recentTasksBody");
  if (!body) return;
  if (!tasks.length) {
    body.innerHTML = `<tr><td colspan="5" class="empty-state">No tasks found</td></tr>`;
    return;
  }
  body.innerHTML = tasks.map((task) => `
    <tr>
      <td>#${valueOrDash(task.id)}</td>
      <td>#${valueOrDash(task.request_id)}</td>
      <td>${escapeHtml(valueOrDash(task.category))}</td>
      <td>${statusBadge(task.status)}</td>
      <td>${formatDateTime(task.assigned_at)}</td>
    </tr>
  `).join("");
}
