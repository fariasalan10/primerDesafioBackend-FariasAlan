const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  }).then((res) => {
    if (res.status == 200) {
      alert("¡Bienvenido!");
      window.location.replace("/");
    } else {
      alert(
        "Clave o Email incorrectos, intenta nuevamente. Si no estás registrado, ¡regístrate!"
      );
    }
  });
});
