const resetPasswordForm = document.getElementById("resetPasswordForm");

resetPasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(resetPasswordForm);
  let payload = {};
  formData.forEach((value, key) => (payload[key] = value));
  fetch("/api/sessions/resetPassword", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    alert("We send you an email to reset your password");
    window.location.replace("/login");
  });
});
