import "dotenv/config";
import express from "express";
import logger from "morgan";

const PORT = process.env.PORT;

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

app.use("/public", express.static(__dirname + "/public"));
app.use(logger("dev"));

const handleListen = () => {
  console.log(`✅ Server Online => http://localhost:${PORT}`);
};
app.listen(PORT, handleListen);
