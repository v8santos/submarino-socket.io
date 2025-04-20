import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import registerGameSocket from "./src/sockets/gameSocket.js";
import { router } from "./src/routes/gameRoutes.js";

const port = 3002;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use(express.json());

app.use("/", router);

io.on("connection", (socket) => {
    console.log(`🟢 ${socket.id} conectado`);
    registerGameSocket(io, socket);
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
