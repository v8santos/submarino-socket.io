import socket from "./io.js";

const submarinersContainer = document.getElementById("submariners");
const form = document.getElementById("submariner-form");
const input = document.getElementById("submariner-name");
let submariners = [];

const log = document.getElementById("messages");

const addToLog = (msg) => {
    const div = document.createElement("div");
    div.classList.add("log");
    div.textContent = msg;
    log.appendChild(div);
};

function submit(event) {
    event.preventDefault();

    const formData = new FormData(form);

    if (input.value) {
        socket.emit("submariner", {
            name: formData.get("name"),
            playerId: localStorage.getItem("playerId"),
        });
    }

    form.reset();
}

function addSubmariners(data) {
    submariners = Object.values(data).map((submariner) => {
        submariner.el = document.createElement("div");

        submariner.el.innerHTML = submariner.name;
        submariner.el.classList.add("button");

        submariner.el.addEventListener("click", (e) => {
            makeVote(e.target, submariner.name);
        });

        submarinersContainer.appendChild(submariner.el);

        return submariner;
    });
}

function makeVote(target, submariner) {
    target.focus();

    socket.emit("vote", {
        submariner,
        playerId: localStorage.getItem("playerId"),
    });
}

form.addEventListener("submit", submit);

// player events
socket.on("player-connected", (playerName) => {
    addToLog(`${playerName} entrou`);
});
socket.on("player-disconnected", (playerName) => {
    addToLog(`${playerName} saiu`);
});

socket.on("update-players", (players) => {
    // Exemplo: listar no HTML
    const list = document.getElementById("players");
    list.innerHTML = "";
    players.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = `Name: ${p.name}`;
        list.appendChild(li);
    });
});

// game events

socket.on("show-submariners", (msg) => {
    addSubmariners(msg);
});
socket.on("votes", (votes) => {
    Object.values(votes).forEach((vote) => {
        const star = document.createElement("span");
        star.innerHTML = "*";
        const current = submariners.find((submariner) => submariner.name == vote.submariner);

        current.el.appendChild(star);
    });
});
