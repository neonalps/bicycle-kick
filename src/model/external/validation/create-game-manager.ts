import { managingRoleValidation } from "./managing-role";
import { personInputValidation } from "./person-input";
import { sortOrderValidation } from "./sort-order";
import { ObjectType } from "./types";

export const createGameManagerValidation: ObjectType = {
    type: 'object',
    required: ['sortOrder', 'person', 'forMain', 'role'],
    properties: {
        sortOrder: sortOrderValidation,
        person: personInputValidation,
        forMain: { type: 'boolean' },
        role: managingRoleValidation,
    },
    additionalProperties: false,
} as const;