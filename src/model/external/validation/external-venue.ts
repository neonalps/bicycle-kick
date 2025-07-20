import { externalProviderValidation } from "./external-provider";
import { ObjectType } from "./types";

export const externalVenueValidation: ObjectType = {
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
        capacity: { type: 'number' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
    },
    additionalProperties: false,
} as const;