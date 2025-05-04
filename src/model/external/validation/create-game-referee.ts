import { personInputValidation } from "./person-input";
import { refereeRoleValidation } from "./referee-role";
import { sortOrderValidation } from "./sort-order";
import { ObjectType } from "./types";

export const createGameRefereeValidation: ObjectType = {
    type: 'object',
    required: ['sortOrder', 'person', 'role'],
    properties: {
        sortOrder: sortOrderValidation,
        person: personInputValidation,
        role: refereeRoleValidation,
    },
    additionalProperties: false,
} as const;