document.addEventListener("DOMContentLoaded", () => {
  redirectIfAuthenticated();

  document
    .getElementById("loginForm")
    ?.addEventListener("submit", loginNgo);

  document
    .getElementById("forgotPasswordLink")
    ?.addEventListener("click", (event) => {
      event.preventDefault();
      showToast(
        "Forgot password is not available because no verified backend endpoint exists.",
        "warning"
      );
    });
});

async function loginNgo(event) {
  event.preventDefault();

  const form = event.currentTarget;

  const payload = {
    email: form.email.value.trim(),
    password: form.password.value
  };

  showSpinner();

  try {

    const response = await api.login(payload);

    console.log(response.data);

    saveSession(
      response.data.token,
      response.data.role,
      form.remember.checked
    );

    showToast(
      response.data.message || "Login Successful",
      "success"
    );

    setTimeout(() => {
      window.location.href =
        getRoleHomePage(response.data.role);
    }, 500);

  } catch (error) {

    showToast(error.message, "danger");

  } finally {

    hideSpinner();

  }
}