import "dotenv/config";
import express from "express";

const PORT = process.env.PORT;

const app = express();

const handleListen = () => {
  console.log(`✅ Server Online => http://localhost:${PORT}`);
};

app.listen(PORT, handleListen);
