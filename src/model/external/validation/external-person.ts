import { externalProviderValidation } from "./external-provider";
import { ObjectType } from "./types";

export const externalPersonValidation: ObjectType = {
    type: 'object',
    required: ['provider', 'id', 'firstName', 'lastName'],
    properties: {
        provider: externalProviderValidation,
        id: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        birthday: { type: 'string' },
        deathday: { type: 'string' },
    },
    additionalProperties: false,
} as const;