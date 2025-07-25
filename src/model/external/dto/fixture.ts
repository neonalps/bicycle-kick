import { DateString } from "@src/util/domain-types";
import { SmallClubDto } from "./small-club";
import { ScoreTuple } from "@src/model/internal/score";

export interface FixtureDto {
    kickoff: DateString;
    home: SmallClubDto;
    away: SmallClubDto;
    fullTime: ScoreTuple;
    halfTime?: ScoreTuple;
    afterExtraTime?: ScoreTuple;
    afterPenaltyShootOut?: ScoreTuple;
    href?: string;
}