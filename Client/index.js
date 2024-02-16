const express = require("express");
const path = require("path");
const app = express();
app.use(express.static("public"));
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "templates", "main.html"));
});
app.listen(8000);
