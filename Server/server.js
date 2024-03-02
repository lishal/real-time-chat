const express = require("express");
const fs = require("fs");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Server } = require("socket.io");
const app = express();

const { MongoClient, ServerApiVersion } = require("mongodb");
app.use(
  cors({
    origin: "https://lian-chat.vercel.app/",
    methods: ["GET", "POST"],
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://lian-chat.vercel.app/",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());
const PORT = process.env.PORT || 4001;

const uri =
  "mongodb+srv://lian:p6efeMzm9RJgCUhW@lian.b0zcvtj.mongodb.net/?retryWrites=true&w=majority&appName=Lian";

async function connectToDatabase() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    return client.db("LIAN");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

async function addDataToCollection(db, collectionName, data) {
  const collection = db.collection(collectionName);
  try {
    await collection.insertOne(data);
  } catch (err) {
    console.error(`Failed to add data to collection ${collectionName}`, err);
    throw err;
  }
}

async function findDataFromCollection(
  db,
  collectionName,
  fieldName,
  findValue
) {
  const collection = db.collection(collectionName);
  const room = await collection.findOne({ [fieldName]: findValue });
  return room;
}
async function countDocument(db, collectionName, fieldName, findValue) {
  const collection = db.collection(collectionName);
  const room = await collection.countDocuments({ [fieldName]: findValue });
  if (room === 0) {
    await deleteUser(db, "Room", fieldName, findValue);
  }
  return !!room;
}
async function checkExistOrNot(db, collectionName, fieldName, findValue) {
  const collection = db.collection(collectionName);
  const room = await collection.findOne({ [fieldName]: findValue });
  return !!room;
}
async function deleteUser(db, collectionName, fieldName, deleteValue) {
  const collection = db.collection(collectionName);
  const room = await collection.deleteOne({ [fieldName]: deleteValue });
  return !!room;
}
async function findAllRecords(db, collectionName, fieldName, fieldValue) {
  const collection = db.collection(collectionName);
  const records = await collection.find({ [fieldName]: fieldValue }).toArray();
  return records;
}
async function cleanData(db) {
  const collection = db.collection("Room");
  const room = await collection.find().toArray();
  room.forEach(async (individualRoom) => {
    await countDocument(db, "RoomUserInfo", "roomId", individualRoom.roomId);
  });
}
// Usage
connectToDatabase()
  .then(async (db) => {
    const roomData = {};
    const userData = {};
    await cleanData(db);
    app.post("/api/createRoom", async (req, res) => {
      const data = req.body;
      (roomData._id = Math.floor(Math.random() * 9999) + Date.now()),
        (roomData.roomId = data.roomId),
        (roomData.userId = data.userId),
        (roomData.roomName = data.roomName);

      const duplicateRoomCheck = await checkExistOrNot(
        db,
        "Room",
        "roomId",
        roomData.roomId
      );
      if (duplicateRoomCheck === false) {
        await addDataToCollection(db, "Room", roomData);
        res.json(data);
      } else {
        res.status(400).json({ error: "Room already exist!" });
      }
    });

    app.post("/api/joinRoom", async (req, res) => {
      const clientData = req.body;
      const roomExist = await checkExistOrNot(
        db,
        "Room",
        "roomId",
        clientData.roomId
      );
      if (roomExist === false) {
        res.status(400).json({ error: "Invalid roomcode" });
      } else {
        res.json(clientData);
      }
    });
    io.on("connection", async (socket) => {
      const socketId = socket.id;
      socket.on("newUser", async (clientData) => {
        (userData._id = clientData.userId),
          (userData.roomId = clientData.roomId),
          (userData.userName = clientData.name);
        userData.socketId = socketId;
        await addDataToCollection(db, "RoomUserInfo", userData);
        const peopleList = await findAllRecords(
          db,
          "RoomUserInfo",
          "roomId",
          userData.roomId
        );
        const roomInfo = await findDataFromCollection(
          db,
          "Room",
          "roomId",
          userData.roomId
        );
        socket.emit("youJoined", {
          peopleList: peopleList,
          roomInfo: roomInfo,
        });
        socket.broadcast.emit("userJoin", {
          peopleList: peopleList,
          roomInfo: roomInfo,
          user: userData.userName,
        });
        await cleanData(db);
      });
      socket.on("sendMessage", async (data) => {
        // console.log(
        //   "sender is:",
        //   data.stateInfo.name,
        //   " and the message is :",
        //   data.message
        // );
        socket.broadcast.emit("receiveMessage", {
          message: data.message,
          roomId: data.stateInfo.roomId,
          userName: data.stateInfo.name,
          userId: data.stateInfo.userId,
        });
      });
      socket.on("disconnect", async () => {
        const userInfo = await findDataFromCollection(
          db,
          "RoomUserInfo",
          "socketId",
          socketId
        );
        await deleteUser(db, "RoomUserInfo", "socketId", socketId);
        if (userInfo != null) {
          const peopleList = await findAllRecords(
            db,
            "RoomUserInfo",
            "roomId",
            userInfo.roomId
          );
          socket.broadcast.emit("leftUser", {
            peopleList: peopleList,
            roomId: userInfo.roomId,
            user: userInfo.userName,
          });
        }
      });
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
