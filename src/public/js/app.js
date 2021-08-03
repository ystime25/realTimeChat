// eslint-disable-next-line no-undef
const socket = io();

const lobby = document.getElementById("lobby");
const lobby_form = lobby.querySelector("form");

const handleEnterRoom = (event) => {
  event.preventDefault();
  const input = lobby_form.querySelector("input");
  socket.emit("enter_room", input.value);
  input.value = "";
};

lobby_form.addEventListener("submit", handleEnterRoom);
