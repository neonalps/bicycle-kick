import { externalVenueValidation } from "./external-venue";
import { ObjectType } from "./types";
import { venueFlavorIdValidation } from "./venue-flavor-id";

export const venueInputValidation: ObjectType = {
    type: 'object',
    required: [],
    properties: {
        venueFlavorId: venueFlavorIdValidation,
        externalVenue: externalVenueValidation,
    },
    additionalProperties: false,
} as const;