import { competitionIdValidation } from "./competition-id";
import { externalVenueValidation } from "./external-venue";
import { ObjectType } from "./types";

export const venueInputValidation: ObjectType = {
    type: 'object',
    required: [],
    properties: {
        venueId: competitionIdValidation,
        externalVenue: externalVenueValidation,
    },
    additionalProperties: false,
} as const;