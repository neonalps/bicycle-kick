import { OverallPosition } from "@src/model/type/position-overall";
import { BasicPersonDto } from "./basic-person";

export interface SquadMemberDto {
    player: BasicPersonDto;
    overallPosition: OverallPosition;
    shirt?: number;
}