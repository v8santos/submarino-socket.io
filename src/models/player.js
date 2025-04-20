import { onlinePlayers } from "../database/db.js";
import { faker } from "@faker-js/faker";

export function createPlayer(name) {
    const playerId = crypto.randomUUID();

    onlinePlayers[playerId] = {
        id: playerId,
        name: name ?? faker.animal.petName(),
        socketId: null,
        conectadoEm: new Date(),
    };

    return playerId;
}
