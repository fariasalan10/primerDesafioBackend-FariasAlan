let MyUserName = "";
const socket = io();

const userNameTitle = document.getElementById("userNameTitle");
const messageInput = document.getElementById("messageInput");
const messagesLog = document.getElementById("messagesLog");

socket.on("chat messages", ({ data }) => {
  messagesLog.innerHTML = "";
  data.forEach((message) => {
    messagesLog.innerHTML += `${message.user} : ${message.message} <br>`;
  });
});

messageInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    socket.emit("new message", {
      user: MyUserName,
      message: event.target.value,
    });
    event.target.value = "";
  }
});

Swal.fire({
  title: "¡Bienvenido! <br> ¿Cuál es tu nombre?",
  text: "Ingresa tu nombre de usuario",
  input: "email",
  allowOutsideClick: false,
}).then((result) => {
  MyUserName = result.value;
  userNameTitle.innerHTML = MyUserName;
});
