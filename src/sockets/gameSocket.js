import { onlinePlayers, submariners, votes, messages } from "../database/db.js";
import config from "../config/app.js";

export default function registerGameSocket(io, socket) {
    function loginEvents(playerId) {
        socket.broadcast.emit("player-connected", onlinePlayers[playerId].name);
        io.emit("update-players", Object.values(onlinePlayers));
        socket.emit("room-data", {
            messages,
            votes,
            submariners,
        });
    }

    socket.on("reconnect", (playerId) => {
        if (!onlinePlayers[playerId]) {
            socket.emit("logout");

            return;
        }
        socket.emit("close-modal");
        loginEvents(playerId);
    });

    socket.on("login", (playerId) => {
        onlinePlayers[playerId].socketId = socket.id;
        loginEvents(playerId);
    });

    io.emit("update-players", Object.values(onlinePlayers));

    socket.on("submariner", ({ name, playerId }) => {
        if (Object.keys(submariners).length < config.submarinersMaxCount) {
            submariners[name] = { name, playerId, creatorId: socket.id };

            if (Object.keys(submariners).length == config.submarinersMaxCount) {
                io.emit("show-submariners", submariners);
            }
        }
    });

    socket.on("vote", ({ submariner, playerId }) => {
        if (Object.keys(votes).length < Object.keys(onlinePlayers).length) {
            votes[playerId] = { submariner, playerId };

            if (Object.keys(votes).length == Object.keys(onlinePlayers).length) {
                io.emit("votes", votes);
            }
        }
    });

    socket.on("message", ({ msg, playerId }) => {
        const message = {
            content: msg,
            playerId,
            senderName: onlinePlayers[playerId].name,
        };
        messages.push(message);
        socket.broadcast.emit("message", message);
    });

    socket.on("disconnect", () => {
        console.log(`🔴 ${socket.id} saiu`);
        const player = Object.values(onlinePlayers).find((player) => (player.socketId = socket.id));

        if (player) {
            socket.broadcast.emit("player-disconnected", player.name);
            onlinePlayers[player.id].online = false;
            delete votes[player.id];
        }
        io.emit("update-players", Object.values(onlinePlayers));
    });
}
