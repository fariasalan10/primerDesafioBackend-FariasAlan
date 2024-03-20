const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(registerForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message == "User already exists") {
        alert("¡Ups! Ese usuario ya existe.");
        return;
      } else {
        alert("¡Tu usuario fue creado correctamente!");
        window.location.replace("/login");
        console.log(data);
        return;
      }
    });
});
