import socket from "./io.js";
const form = document.getElementById("chat-form");
const messagesContainer = document.getElementById("messages");

form.addEventListener("submit", (e) => {
    const formData = new FormData(e.target);
    const messageDiv = document.createElement("div");
    const messageContent = formData.get("message");

    messageDiv.innerHTML = `<div>${messageContent}</div>`;
    messageDiv.classList.add("sended", "message");
    messagesContainer.appendChild(messageDiv);

    if (messageContent) {
        socket.emit("message", {
            msg: messageContent,
            playerId: localStorage.getItem("playerId"),
        });
    }

    form.reset();
});

socket.on("message", (message) => {
    const messageDiv = document.createElement("div");

    messageDiv.innerHTML = `<small>${message.senderName}</small><div>
    ${message.content}</div>`;
    messageDiv.classList.add("received", "message");
    messagesContainer.appendChild(messageDiv);
});
