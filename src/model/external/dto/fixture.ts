import { DateString } from "@src/util/domain-types";
import { SmallClubDto } from "./small-club";
import { ScoreTuple } from "@src/model/internal/score";
import { GameStatus } from "@src/model/type/game-status";

export interface FixtureDto {
    kickoff: DateString;
    status: GameStatus;
    home: SmallClubDto;
    away: SmallClubDto;
    fullTime?: ScoreTuple;
    halfTime?: ScoreTuple;
    afterExtraTime?: ScoreTuple;
    afterPenaltyShootOut?: ScoreTuple;
    href?: string;
}