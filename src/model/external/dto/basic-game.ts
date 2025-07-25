import { Tendency } from "@src/model/type/tendency";
import { GameVenueDto } from "./game-venue";
import { GameStatus } from "@src/model/type/game-status";
import { ScoreTuple } from "@src/model/internal/score";
import { SmallSeasonDto } from "./small-season";
import { SmallCompetitionDto } from "./small-competition";
import { SmallClubDto } from "./small-club";
import { DateString } from "@src/util/domain-types";

export interface BasicGameDto {
    id: number;
    kickoff: DateString;
    opponent: SmallClubDto;
    season: SmallSeasonDto;
    competition: SmallCompetitionDto;
    round: string;
    stage?: string;
    isHomeGame: boolean;
    status: GameStatus;
    resultTendency: Tendency;
    fullTime?: ScoreTuple;
    halfTime?: ScoreTuple;
    afterExtraTime?: ScoreTuple;
    penaltyShootOut?: ScoreTuple;
    attendance?: number;
    venue: GameVenueDto;
    leg?: number;
    previousLeg?: number;
    isSoldOut?: boolean;
    isNeutralGround?: boolean;
    scheduled?: Date;
    titleWinningGame?: boolean;
    titleCount?: number;
    victoryGameText?: string;
}