import { externalPersonValidation } from "./external-person";
import { personIdValidation } from "./person-id";
import { ObjectType } from "./types";

export const personInputValidation: ObjectType = {
    type: 'object',
    required: [],
    properties: {
        personId: personIdValidation,
        externalPerson: externalPersonValidation,
    },
    additionalProperties: false,
} as const;