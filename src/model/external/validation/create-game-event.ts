import { gameEventTypeValidation } from "./game-event-type";
import { sortOrderValidation } from "./sort-order";
import { ObjectType } from "./types";

export const createGameEventValidation: ObjectType = {
    type: 'object',
    required: ['sortOrder', 'type', 'minute'],
    properties: {
        sortOrder: sortOrderValidation,
        type: gameEventTypeValidation,
        minute: { type: 'string' },
    },
    additionalProperties: true,
} as const;