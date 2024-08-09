const resetPasswordForm = document.getElementById("resetPasswordForm");
let messageElement = document.getElementById("password-error-message");
resetPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(resetPasswordForm);
  let payload = {};
  formData.forEach((value, key) => (payload[key] = value));
  fetch("/api/sessions/changePassword", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    if (res.status == 400) {
      res.json().then((res) => {
        if (res.error == "same password") {
          messageElement.innerHTML = "Can't use same password";
        }
      });
    } else {
      alert("Password changed succesfully!");
      window.location.replace("/login");
    }
  });
});
