import { clubIdValidation } from "./club-id";
import { externalClubValidation } from "./external-club";
import { ObjectType } from "./types";

export const clubInputValidation: ObjectType = {
    type: 'object',
    required: [],
    properties: {
        clubId: clubIdValidation,
        externalClub: externalClubValidation,
    },
    additionalProperties: false,
} as const;