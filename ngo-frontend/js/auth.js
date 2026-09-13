function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
  
}

function saveSession(token, role, remember) {
  const user = decodeJwt(token);
  const resolvedRole = role || user.role || "NGO_ADMIN";
  const session = {
    id: user.id || null,
    email: user.email || "",
    role: resolvedRole,
    ngoId: user.ngo_id || null,
    remember: Boolean(remember),
    ngoId: user.ngo_id ? Number(user.ngo_id) : null,
    loginAt: new Date().toISOString()
  };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem("dgnv_ngo_role", resolvedRole);
  localStorage.setItem(USER_KEY, JSON.stringify(session));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || {};
  } catch {
    return {};
  }
}

function requireAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function redirectIfAuthenticated() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    const session = getSession();
    window.location.href = getRoleHomePage(session.role);
  }
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("dgnv_ngo_role");
  localStorage.removeItem(USER_KEY);
  window.location.href = "login.html";
}

function getRoleHomePage(role) {
  return role === "VOLUNTEER" ? "volunteer-dashboard.html" : "dashboard.html";
}

function setupAuthenticatedLayout() {
  if (!requireAuth()) return;
  setupSidebar();

  const session = getSession();
  document.querySelectorAll("[data-user-email]").forEach((element) => {
    element.textContent = session.email || "NGO Admin";
  });
  document.querySelectorAll("[data-user-role]").forEach((element) => {
    element.textContent = session.role || "NGO_ADMIN";
  });
  document.querySelectorAll("[data-logout]").forEach((element) => {
    element.addEventListener("click", logout);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
});
