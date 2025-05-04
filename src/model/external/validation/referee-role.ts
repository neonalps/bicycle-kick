import { StringEnumType } from "./types";
import { RefereeRole } from "@src/model/external/dto/referee-role";

export const refereeRoleValidation: StringEnumType = {
    type: 'string',
    enum: [RefereeRole.Referee, RefereeRole.AssistantReferee, RefereeRole.FourthOfficial, RefereeRole.Var, RefereeRole.AssistantVar],
} as const;