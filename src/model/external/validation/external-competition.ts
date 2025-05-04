import { externalProviderValidation } from "./external-provider";
import { ObjectType } from "./types";

export const externalCompetitionValidation: ObjectType = {
    type: 'object',
    required: ['provider', 'id', 'name', 'shortName'],
    properties: {
        provider: externalProviderValidation,
        id: { type: 'string' },
        name: { type: 'string' },
        shortName: { type: 'string' },
        
    },
    additionalProperties: false,
} as const;