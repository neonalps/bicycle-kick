import { competitionIdValidation } from "./competition-id";
import { externalCompetitionValidation } from "./external-competition";
import { ObjectType } from "./types";

export const competitionInputValidation: ObjectType = {
    type: 'object',
    required: [],
    properties: {
        competitionId: competitionIdValidation,
        externalCompetition: externalCompetitionValidation,
    },
    additionalProperties: false,
} as const;