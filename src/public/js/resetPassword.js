const form = document.getElementById("resetPasswordForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const payload = {};
  data.forEach((value, key) => (payload[key] = value));
  fetch("/api/sessions/resetPassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (res.status == 200) {
      alert("¡Tu clave fue cambiada correctamente!");
      window.location.replace("/");
    } else {
      alert("Clave incorrecta, intenta nuevamente");
    }
  });
});
