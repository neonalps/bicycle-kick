import { clubInputValidation } from "./club-input";
import { competitionInputValidation } from "./competition-input";
import { gameInputValidation } from "./game-input";
import { gameStatusValidation } from "./game-status";
import { ObjectType } from "./types";
import { venueInputValidation } from "./venue-input";

export const updateGameRequestSchema: ObjectType = {
    type: 'object',
    required: [
        'kickoff',
        'opponent',
        'competition',
        'competitionRound',
        'venue',
        'isHomeGame',
        'status',
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
    },
    additionalProperties: false,
}