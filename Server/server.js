const express = require("express");
const fs = require("fs");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Server } = require("socket.io");
const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());
const PORT = process.env.PORT || 4001;

const users = {};

io.on("connection", (socket) => {
  const socketid = socket.id;
  socket.on("newUser", (clientData) => {
    // Add Active user in JSON
    fs.readFile("userInRoom.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      try {
        if (data != "") {
          userInRoomData = JSON.parse(data);
          if (clientData != null) {
            const roomIndex = userInRoomData.findIndex(
              (room) => room.roomId === clientData.roomId
            );
            if (roomIndex !== -1) {
              const room = userInRoomData[roomIndex];
              if (!room.activeUsers.some((user) => user.userId === socketid)) {
                room.activeUsers.push({
                  userId: socket.id,
                  userName: clientData.name || clientData.owner,
                });
                fs.writeFile(
                  "userInRoom.json",
                  JSON.stringify(userInRoomData, null, 4),
                  "utf8",
                  (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                  }
                );
              }
            } else {
              const data = {
                roomId: clientData.roomId,
                owner: clientData.owner,
                roomName: clientData.roomName,
                activeUsers: [
                  {
                    userId: socketid,
                    userName: clientData.owner,
                  },
                ],
              };
              userInRoomData.push(data);
              fs.writeFile(
                "userInRoom.json",
                JSON.stringify(userInRoomData, null, 5),
                "utf8",
                (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                }
              );
            }
          }
        } else {
          const data = {
            roomId: clientData.roomId,
            owner: clientData.owner || "Bot",
            roomName: clientData.roomName || "Auto created Room",
            activeUsers: [
              {
                userId: socketid,
                userName: clientData.owner || clientData.name,
              },
            ],
          };
          fs.writeFile(
            "userInRoom.json",
            JSON.stringify([data], null, 5),
            "utf8",
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
            }
          );
        }
      } catch (err) {
        console.error("Error parsing JSON data:", err);
      }
    });

    // data.userId = socket.id;
    // socket.broadcast.emit("userJoined", name);
  });
  socket.on("sendMessage", (message) => {
    socket.broadcast.emit("receiveMessage", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    fs.readFile("userInRoom.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      try {
        if (data != "") {
          const userData = JSON.parse(data);
          const roomActiveMembers = userData.map((room) => ({
            ...room,
            activeUsers: room.activeUsers.filter(
              (user) => user.userId !== socketid
            ),
          }));
          fs.writeFile(
            "userInRoom.json",
            JSON.stringify(roomActiveMembers, null, 4),
            "utf8",
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
            }
          );
        }
      } catch (err) {
        console.error("Error parsing JSON data:", err);
      }
    });
    //   socket.broadcast.emit("disconnectedUser", users[socket.id]);
    //   delete users[socket.id];
  });
});

app.post("/api/joinRoom", (req, res) => {
  const clientData = req.body;
  fs.readFile("userInRoom.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      if (data != "") {
        activeRoom = JSON.parse(data);
        const filteredRoomCode = activeRoom.filter(
          (element) => element.roomId === clientData.roomId
        );
        if (filteredRoomCode.length != 0) {
          res.json(clientData);
        } else {
          res.status(400).json({ error: "Invalid roomcode" });
        }
      } else {
        res.status(400).json({ error: "Invalid roomcode" });
      }
    } catch (err) {
      console.error("Error parsing JSON data:", err);
    }
  });
});

app.post("/api/createRoom", (req, res) => {
  const roomData = req.body;
  fs.readFile("userInRoom.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    if (data != "") {
      try {
        userinroomData = JSON.parse(data);
        const filteredRoomCode = userinroomData.filter(
          (element) => element.roomId === roomData.roomId
        );
        if (filteredRoomCode.length != 0) {
          res.status(400).json({ error: "Room already exist!" });
        } else {
          res.json(roomData);
        }
      } catch (err) {
        console.error("Error parsing JSON data:", err);
      }
    } else {
      res.json(roomData);
    }
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
