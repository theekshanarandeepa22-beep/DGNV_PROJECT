document.addEventListener("DOMContentLoaded", () => {
  redirectIfAuthenticated();
  document.getElementById("registerForm")?.addEventListener("submit", registerNgo);
});

async function registerNgo(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const categories = Array.from(form.categories.selectedOptions).map((option) => option.value);
  const payload = {
    ngoName: form.ngoName.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    phone: form.phone.value.trim(),
    district: form.district.value.trim(),
    categories
  };

  showSpinner();
  try {
    const response = await api.registerNgo(payload);
    showToast(response.data?.message || "Registration successful", "success");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 900);
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    hideSpinner();
  }
}
