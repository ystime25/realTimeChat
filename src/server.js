import "dotenv/config";
//import WebSocket from "ws";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import http from "http";
import express from "express";
import logger from "morgan";

const PORT = process.env.PORT;

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.use(logger("dev"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

const countRoom = (roomName) => {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
};

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("joinNoti", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("exitNoti", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("new_nickname", (nickname) => (socket["nickname"] = nickname));
});

//WebSocket way
/*
const wss = new WebSocket.Server({ server });
const sockets = [];
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Browser Connection Confirmed ✅");
  socket.on("close", () => {
    console.log("Browser Disconnected 🛑");
  });
  socket.on("message", (message) => {
    const msg = JSON.parse(message);
    switch (msg.type) {
      case "new_msg":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${msg.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = msg.payload;
    }
  });
});*/
const handleListen = () => {
  console.log(`Server Online => http://localhost:${PORT} ✅`);
};
httpServer.listen(PORT, handleListen);
