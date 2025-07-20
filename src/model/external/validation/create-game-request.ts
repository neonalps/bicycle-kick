import { clubInputValidation } from "./club-input";
import { competitionInputValidation } from "./competition-input";
import { createGameEventValidation } from "./create-game-event";
import { createGameManagerValidation } from "./create-game-manager";
import { createGamePlayerValidation } from "./create-game-player";
import { createGameRefereeValidation } from "./create-game-referee";
import { gameInputValidation } from "./game-input";
import { gameStatusValidation } from "./game-status";
import { ObjectType } from "./types";
import { venueInputValidation } from "./venue-input";

export const createGameRequestSchema: ObjectType = {
    type: 'object',
    required: [
        'kickoff',
        'opponent',
        'competition',
        'competitionRound',
        'venue',
        'isHomeGame',
        'status',
        'lineupMain',
        'lineupOpponent',
        'managersMain',
        'managersOpponent',
        'referees',
        'events',
    ],
    properties: {
        kickoff: { type: 'string' },
        opponent: clubInputValidation,
        competition: competitionInputValidation,
        competitionRound: { type: 'string' },
        isHomeGame: { type: 'boolean' },
        venue: venueInputValidation,
        status: gameStatusValidation,
        attendance: { type: 'number' },
        isSoldOut: { type: 'boolean' },
        isNeutralGround: { type: 'boolean' },
        isPractice: { type: 'boolean' },
        leg: { type: 'number' },
        previousLeg: gameInputValidation,
        lineupMain: {
            type: 'array',
            items: createGamePlayerValidation,
        },
        lineupOpponent: {
            type: 'array',
            items: createGamePlayerValidation,
        },
        managersMain: {
            type: 'array',
            items: createGameManagerValidation,
        },
        managersOpponent: {
            type: 'array',
            items: createGameManagerValidation,
        },
        referees: {
            type: 'array',
            items: createGameRefereeValidation,
        },
        events: {
            type: 'array',
            items: createGameEventValidation,
        },
    },
    additionalProperties: false,
}