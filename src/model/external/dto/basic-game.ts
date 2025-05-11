import { Tendency } from "@src/model/type/tendency";
import { GameVenueDto } from "./game-venue";
import { GameStatus } from "@src/model/type/game-status";
import { ScoreTuple } from "@src/model/internal/score";
import { SmallSeasonDto } from "./small-season";
import { SmallCompetitionDto } from "./small-competition";
import { SmallClubDto } from "./small-club";

export interface BasicGameDto {
    id: number;
    kickoff: Date;
    opponent: SmallClubDto;
    season: SmallSeasonDto;
    competition: SmallCompetitionDto;
    round: string;
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
    previousLeg?: BasicGameDto;
    isNeutralGround?: boolean;
    scheduled?: Date;
    accountAttended?: boolean;
    accountStarred?: boolean;
    accountNotes?: string;
}