const messageList = document.getElementById("messageList");
const messageForm = document.getElementById("messageForm");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Server Connection Confirmed ✅");
});

socket.addEventListener("message", (message) => {
  console.log("Incomming Message: ", message.data);
});

socket.addEventListener("close", () => {
  console.log("Server Disconnected 🛑");
});

const handleChatSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
};

messageForm.addEventListener("submit", handleChatSubmit);
