const io = require("socket.io")(4000, {
  cors: {
    origin: "*",
  },
});
const users = {};
io.on("connection", (socket) => {
  socket.on("newUser", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("userJoined", name);
  });
  socket.on("sendMessage", (message) => {
    socket.broadcast.emit("receiveMessage", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnectedUser", users[socket.id]);
    delete users[socket.id];
  });
});
