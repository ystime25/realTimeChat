// eslint-disable-next-line no-undef
const socket = io();

const lobby = document.getElementById("lobby");
const lobby_form = lobby.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const enterRoom = () => {
  lobby.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = roomName;
};

const handleEnterRoom = (event) => {
  event.preventDefault();
  const input = lobby_form.querySelector("input");
  socket.emit("enter_room", input.value, enterRoom);
  roomName = input.value;
  input.value = "";
};

lobby_form.addEventListener("submit", handleEnterRoom);

socket.on("joinNoti", () => {
  addMessage("someone joined");
});
