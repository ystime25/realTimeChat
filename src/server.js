import "dotenv/config";
import WebSocket from "ws";
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

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Browser Connection Confirmed ✅");
  socket.on("close", () => {
    console.log("Browser Disconnected 🛑");
  });
  socket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(message));
  });
});

server.listen(PORT, handleListen);
