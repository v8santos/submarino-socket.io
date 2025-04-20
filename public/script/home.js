import socket from "./io.js";
const form = document.getElementById("player-form");
const modal = document.getElementById("modal");
const loadingScreen = document.getElementById("load-screen");

function closeModal() {
    modal.classList.add("hidden");
}

const playerId = localStorage.getItem("playerId");

if (playerId) {
    socket.emit("reconnect", playerId);
    socket.on("close-modal", () => {
        closeModal();
        loadingScreen.classList.add("hidden");
    });
} else {
    loadingScreen.classList.add("hidden");
}

socket.on("logout", (msg) => {
    localStorage.removeItem("playerId");
    window.location.reload();
});

form.addEventListener("submit", (e) => {
    const formData = new FormData(e.target);
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: formData.get("playerName"),
            playerId: socket.id,
        }),
    })
        .then((res) => res.json())
        .then((json) => {
            if (json.success) {
                socket.emit("login", json.playerId);
                localStorage.setItem("playerId", json.playerId);
                closeModal();
            } else {
                alert("Login inválido");
            }
        });
});
