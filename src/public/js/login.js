const loginForm = document.getElementById("loginForm");
const errorLogin = document.getElementById("login-error-message");

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
      errorLogin.style.opacity = "0";
      window.location.replace("/");
    } else {
      errorLogin.style.opacity = "1";
    }
  });
});

const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");

const loginDiv = document.querySelector(".login-form");
const registerDiv = document.querySelector(".register-form");

loginBtn.addEventListener("click", () => {
  loginBtn.style.backgroundColor = "blueviolet";
  registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

  loginDiv.style.left = "50%";
  registerDiv.style.left = "-50%";

  loginDiv.style.opacity = "1";
  registerDiv.style.opacity = "0";

  document.querySelector(".col-1").style.borderRadius = "0 30% 20% 0";
});

registerBtn.addEventListener("click", () => {
  registerBtn.style.backgroundColor = "blueviolet";
  loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

  loginDiv.style.left = "150%";
  registerDiv.style.left = "50%";

  loginDiv.style.opacity = "0";
  registerDiv.style.opacity = "1";

  document.querySelector(".col-1").style.borderRadius = "0 20% 30% 0";
});
