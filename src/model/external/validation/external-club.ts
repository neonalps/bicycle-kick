import { externalProviderValidation } from "./external-provider";
import { ObjectType } from "./types";

export const externalClubValidation: ObjectType = {
    type: 'object',
    required: ['provider', 'id', 'name', 'shortName', 'city', 'countryCode'],
    properties: {
        provider: externalProviderValidation,
        id: { type: 'string' },
        name: { type: 'string' },
        shortName: { type: 'string' },
        city: { type: 'string' },
        district: { type: 'string' },
        countryCode: { type: 'string' },
        primaryColour: { type: 'string' },
        secondaryColour: { type: 'string' },
        iconLarge: { type: 'string' },
        iconSmall: { type: 'string' },
    },
    additionalProperties: false,
} as const;