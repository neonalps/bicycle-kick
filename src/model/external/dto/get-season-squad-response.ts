import { OverallPosition } from "@src/model/type/position-overall";
import { SquadMemberDto } from "./squad-member";

export interface GetSeasonSquadResponseDto {
    squad: Record<OverallPosition, Array<SquadMemberDto>>;
}
