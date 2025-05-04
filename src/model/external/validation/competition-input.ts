import { competitionIdValidation } from "./competition-id";
import { externalClubValidation } from "./external-club";
import { ObjectType } from "./types";

export const competitionInputValidation: ObjectType = {
    type: 'object',
    required: [],
    properties: {
        competitionId: competitionIdValidation,
        externalCompetition: externalClubValidation,
    },
    additionalProperties: false,
} as const;