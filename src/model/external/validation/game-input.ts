import { gameIdValidation } from "./game-id";
import { ObjectType } from "./types";

export const gameInputValidation: ObjectType = {
    type: 'object',
    required: [],
    properties: {
        gameId: gameIdValidation,
    },
    additionalProperties: false,
} as const;