const socket = io();
let user = "";
let chat = document.getElementById("chat");

Swal.fire({
  title: "Ingresa tu mail",
  input: "Email",
  inputLabel: "Your email address",
  inputPlaceholder: "Enter your email address",
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
});

chat.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    socket.emit("message", {
      user,
      message: event.target.value,
    });
    event.target.value = "";
  }
});

socket.on("messageLog", ({ data }) => {
  let log = document.getElementById("mensajes");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} : ${message.message} <br>`;
  });
  log.innerHTML = messages;
});
