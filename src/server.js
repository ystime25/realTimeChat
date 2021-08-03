import "dotenv/config";
//import WebSocket from "ws";
import SocketIO from "socket.io";
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

const handleListen = () => {
  console.log(`Server Online => http://localhost:${PORT} ✅`);
};

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName) => {
    console.log(roomName);
  });
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

httpServer.listen(PORT, handleListen);
