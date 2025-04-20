import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createPlayer } from "../models/player.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(join(__dirname, "public", "index.html"));
});

router.get("/game", (req, res) => {
    res.sendFile(join(__dirname, "public", "game.html"));
});

router.post("/register", (req, res) => {
    const { name } = req.body;
    const playerId = createPlayer(name);

    res.json({
        success: true,
        playerId,
    });
});

export { router };
