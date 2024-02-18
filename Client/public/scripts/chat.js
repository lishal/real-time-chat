document.addEventListener("DOMContentLoaded", function (e) {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  if (!name) {
    window.location.href = "./index.html";
  } else {
    document.getElementById("userName").innerHTML = "Hello " + name;
    const socket = io("https://lian-bfit.onrender.com");

    const messageArea = document.querySelector(".message-area");
    function scrollToBottom() {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
    const audio = new Audio("../assets/ting.mp4");
    const appendMessage = (message, position) => {
      const newElement = document.createElement("div");
      newElement.innerHTML = message;
      newElement.classList.add("message");
      newElement.classList.add(position);
      messageArea.append(newElement);
      if (position == "left" || position == "center") {
        audio.play();
      }
      scrollToBottom();
    };

    const btnStatus = document.getElementById("sendBtn");
    btnStatus.addEventListener("click", (e) => {
      e.preventDefault();
      const message = document.getElementById("message").value;
      socket.emit("sendMessage", message);
      appendMessage(`You: ${message}`, "right");
      document.getElementById("message").value = "";
    });
    socket.on("receiveMessage", (data) => {
      appendMessage(`${data.name}: ${data.message}`, "left");
    });
    socket.emit("newUser", name);
    socket.on("userJoined", (name) => {
      appendMessage(`${name} joined the chat!`, "center");
    });
    socket.on("disconnectedUser", (name) => {
      appendMessage(`${name} has left the chat!`, "center");
    });
  }
});
