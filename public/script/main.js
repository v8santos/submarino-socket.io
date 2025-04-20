import "./home.js";
import "./game.js";
import "./chat.js";
import socket from "./io.js";

const messagesContainer = document.getElementById("messages");

socket.on("room-data", (data) => {
    const playerId = localStorage.getItem("playerId");
    Object.values(data.messages).forEach((message) => {
        const messageDiv = document.createElement("div");
        const senderName = playerId == message.playerId ? "" : message.senderName;

        messageDiv.innerHTML = `<small>${senderName}</small><div>
        ${message.content}
        </div>`;
        messageDiv.classList.add(playerId == message.playerId ? "sended" : "received", "message");
        messagesContainer.appendChild(messageDiv);
    });
});
