import { ManagingRole } from "@src/model/type/managing-role";
import { StringEnumType } from "./types";

export const managingRoleValidation: StringEnumType = {
    type: 'string',
    enum: [ManagingRole.HeadCoach, ManagingRole.AssistantCoach],
} as const;