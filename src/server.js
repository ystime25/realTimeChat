import "dotenv/config";
import express from "express";

const PORT = process.env.PORT;

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

const handleListen = () => {
  console.log(`✅ Server Online => http://localhost:${PORT}`);
};
app.listen(PORT, handleListen);
