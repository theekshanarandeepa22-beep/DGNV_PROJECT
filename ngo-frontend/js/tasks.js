let allTasks = [];
let taskState = {
  page: 1,
  pageSize: 8,
  total: 0,
  search: ""
};

const taskActions = [
  ["accept", "Accept", "bi-check2-circle"],
  ["start", "Start", "bi-play-circle"],
  ["arrived", "Arrived", "bi-geo-alt"],
  ["service-provided", "Service", "bi-tools"],
  ["complete", "Complete", "bi-check-circle"]
];

document.addEventListener("DOMContentLoaded", async () => {
  setupAuthenticatedLayout();
  document.getElementById("taskSearch")?.addEventListener("input", (event) => {
    taskState.search = event.target.value.trim().toLowerCase();
    taskState.page = 1;
    renderTasks();
  });
  document.getElementById("taskRefreshBtn")?.addEventListener("click", loadTasks);
  await loadTasks();
});

async function loadTasks() {
  showSpinner();
  try {
    const response = await api.getTasks();
    allTasks = Array.isArray(response.data) ? response.data : [];
    renderTasks();
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    hideSpinner();
  }
}

function renderTasks() {
  const body = document.getElementById("tasksBody");
  if (!body) return;

  const filtered = allTasks.filter((task) => {
    const haystack = [
      task.id,
      task.request_id,
      task.volunteer_id,
      task.category,
      task.priority,
      task.district,
      task.ds_division,
      task.gs_division,
      task.status
    ].join(" ").toLowerCase();
    return haystack.includes(taskState.search);
  });

  taskState.total = filtered.length;
  const start = (taskState.page - 1) * taskState.pageSize;
  const pageRows = filtered.slice(start, start + taskState.pageSize);

  if (!pageRows.length) {
    body.innerHTML = `<tr><td colspan="9" class="empty-state">No tasks found</td></tr>`;
  } else {
    body.innerHTML = pageRows.map((task) => `
      <tr>
        <td>#${valueOrDash(task.id)}</td>
        <td>#${valueOrDash(task.request_id)}</td>
        <td>#${valueOrDash(task.volunteer_id)}</td>
        <td>${escapeHtml(valueOrDash(task.category))}</td>
        <td>${priorityBadge(task.priority)}</td>
        <td>${escapeHtml(valueOrDash(task.district))}</td>
        <td>${statusBadge(task.status)}</td>
        <td>${formatDateTime(task.assigned_at)}</td>
        <td class="text-nowrap">
          ${taskActions.map(([action, label, icon]) => `
            <button class="btn btn-sm btn-outline-primary me-1 mb-1" data-task-action="${action}" data-task-id="${task.id}" title="${label}">
              <i class="bi ${icon}"></i>
            </button>
          `).join("")}
        </td>
      </tr>
    `).join("");
  }

  body.querySelectorAll("[data-task-action]").forEach((button) => {
    button.addEventListener("click", () => runTaskAction(button.dataset.taskId, button.dataset.taskAction));
  });

  document.getElementById("taskCount").textContent = `${filtered.length} task${filtered.length === 1 ? "" : "s"}`;
  renderPagination("tasksPagination", taskState, (page) => {
    taskState.page = page;
    renderTasks();
  });
}

async function runTaskAction(taskId, action) {
  if (!confirmAction(`Update task #${taskId} with action "${action}"?`)) return;
  showSpinner();
  try {
    const response = await api.updateTask(taskId, action);
    showToast(response.data?.message || "Task updated successfully", "success");
    await loadTasks();
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    hideSpinner();
  }
}
