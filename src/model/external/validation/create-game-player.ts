import { personInputValidation } from "./person-input";
import { sortOrderValidation } from "./sort-order";
import { ObjectType } from "./types";

export const createGamePlayerValidation: ObjectType = {
    type: 'object',
    required: ['sortOrder', 'person', 'shirt', 'forMain', 'isStarting', 'isCaptain'],
    properties: {
        sortOrder: sortOrderValidation,
        person: personInputValidation,
        shirt: { type: 'number' },
        forMain: { type: 'boolean' },
        isStarting: { type: 'boolean' },
        isCaptain: { type: 'boolean' },
        positionKey: { type: 'string' },
        positionGrid: { type: 'number' },
    },
    additionalProperties: false,
} as const;