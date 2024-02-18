document.getElementById("joinBtn").addEventListener("click", () => {
  const name = document.getElementById("nameText").value;
  if (name != "") {
    document.getElementById("nameText").value = "";
    window.location.href = "./chat.html?name=" + encodeURI(name);
  }
});
