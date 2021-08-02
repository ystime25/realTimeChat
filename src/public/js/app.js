const messageList = document.getElementById("messageList");
const messageForm = document.getElementById("messageForm");
const nicknameForm = document.getElementById("nicknameForm");
const socket = new WebSocket(`ws://${window.location.host}`);

const makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

socket.addEventListener("open", () => {
  console.log("Server Connection Confirmed ✅");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerHTML = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Server Disconnected 🛑");
});

const handleChatSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_msg", input.value));
  input.value = "";
};

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
};

messageForm.addEventListener("submit", handleChatSubmit);
nicknameForm.addEventListener("submit", handleNickSubmit);
