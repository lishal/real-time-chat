document.addEventListener("DOMContentLoaded", function (e) {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  if (!name) {
    window.location.href = "./landing.html";
  } else {
    document.getElementById("userName").innerHTML = "Hello " + name;
  }
});
