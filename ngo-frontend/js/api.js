const API_BASES = {
  auth: "http://localhost:9201",
  volunteers: "http://localhost:9202",
  requests: "http://localhost:9203"
};

const TOKEN_KEY = "dgnv_ngo_token";
const USER_KEY = "dgnv_ngo_user";

const http = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.sqlMessage ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

const api = {
  registerNgo(payload) {
    return http.post(`${API_BASES.auth}/api/auth/register-ngo`, payload);
  },

  login(payload) {
    return http.post(`${API_BASES.auth}/api/auth/login`, payload);
  },

  getDashboardSummary() {
    return http.get(`${API_BASES.requests}/api/dashboard/summary`);
  },

  getRequests() {
    return http.get(`${API_BASES.requests}/api/requests`);
  },

  assignVolunteer(requestId) {
    return http.post(`${API_BASES.requests}/api/requests/${requestId}/assign-volunteer`);
  },

  getTasks() {
    return http.get(`${API_BASES.requests}/api/tasks`);
  },

  updateTask(taskId, action) {
    return http.put(`${API_BASES.requests}/api/tasks/${taskId}/${action}`);
  },

  getVolunteers() {
    return http.get(`${API_BASES.volunteers}/api/volunteers`);
  },

  getVolunteer(id) {
    return http.get(`${API_BASES.volunteers}/api/volunteers/${id}`);
  },

  getAvailableVolunteers() {
    return http.get(`${API_BASES.volunteers}/api/volunteers/available`);
  },

  addVolunteer(payload) {
    return http.post(`${API_BASES.volunteers}/api/volunteers`, payload);
  },

  updateVolunteer(id, payload) {
    return http.put(`${API_BASES.volunteers}/api/volunteers/${id}`, payload);
  },

  deleteVolunteer(id) {
    return http.delete(`${API_BASES.volunteers}/api/volunteers/${id}`);
  }
};

function showSpinner() {
  document.getElementById("spinnerOverlay")?.classList.add("show");
}

function hideSpinner() {
  document.getElementById("spinnerOverlay")?.classList.remove("show");
}

function showToast(message, type = "primary") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${type} border-0`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${escapeHtml(message)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  container.appendChild(toast);

  const instance = new bootstrap.Toast(toast, { delay: 3500 });
  toast.addEventListener("hidden.bs.toast", () => toast.remove());
  instance.show();
}

function confirmAction(message) {
  return window.confirm(message);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function valueOrDash(value) {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function normalizeStatus(value) {
  return String(value || "UNKNOWN").replaceAll("_", " ");
}

function statusBadge(value) {
  const status = String(value || "UNKNOWN").toUpperCase();
  let className = "badge-status-pending";
  if (status.includes("COMPLETED")) className = "badge-status-completed";
  else if (status.includes("ASSIGNED")) className = "badge-status-assigned";
  else if (status.includes("PROGRESS")) className = "badge-status-progress";
  else if (status.includes("ARRIVED")) className = "badge-status-arrived";
  else if (status.includes("RECEIVED")) className = "badge-status-received";
  else if (status.includes("BUSY")) className = "badge-status-busy";
  else if (status.includes("AVAILABLE")) className = "badge-status-available";
  return `<span class="badge badge-soft ${className}">${escapeHtml(normalizeStatus(status))}</span>`;
}

function priorityBadge(value) {
  const priority = String(value || "UNSET").toUpperCase();
  let className = "badge-priority-low";
  if (priority === "CRITICAL" || priority === "HIGH") className = "badge-priority-high";
  else if (priority === "MEDIUM") className = "badge-priority-medium";
  return `<span class="badge badge-soft ${className}">${escapeHtml(priority)}</span>`;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function setupSidebar() {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const toggle = document.getElementById("sidebarToggle");

  toggle?.addEventListener("click", () => {
    sidebar?.classList.add("show");
    backdrop?.classList.add("show");
  });

  backdrop?.addEventListener("click", () => {
    sidebar?.classList.remove("show");
    backdrop.classList.remove("show");
  });

  const current = window.location.pathname.split("/").pop();
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}

function renderPagination(containerId, state, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.max(1, Math.ceil(state.total / state.pageSize));
  const buttons = [];

  for (let page = 1; page <= totalPages; page += 1) {
    buttons.push(`
      <li class="page-item ${page === state.page ? "active" : ""}">
        <button class="page-link" data-page="${page}">${page}</button>
      </li>
    `);
  }

  container.innerHTML = `
    <ul class="pagination pagination-sm mb-0">
      <li class="page-item ${state.page === 1 ? "disabled" : ""}">
        <button class="page-link" data-page="${state.page - 1}">Previous</button>
      </li>
      ${buttons.join("")}
      <li class="page-item ${state.page === totalPages ? "disabled" : ""}">
        <button class="page-link" data-page="${state.page + 1}">Next</button>
      </li>
    </ul>
  `;

  container.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const page = Number(button.dataset.page);
      if (page >= 1 && page <= totalPages && page !== state.page) {
        onPageChange(page);
      }
    });
  });
}
