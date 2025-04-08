import { Tendency } from "@src/model/type/tendency";
import { BasicClubDto } from "./basic-club";
import { CompetitionDto } from "./competition";
import { GameVenueDto } from "./game-venue";
import { SeasonDto } from "./season";
import { GameStatus } from "@src/model/type/game-status";

export interface BasicGameDto {
    id: number;
    kickoff: Date;
    opponent: BasicClubDto;
    season: SeasonDto;
    competition: CompetitionDto;
    round: string;
    isHomeGame: boolean;
    attendance: number;
    status: GameStatus;
    resultTendency: Tendency;
    fullTimeGoalsMain: number;
    fullTimeGoalsOpponent: number;
    halfTimeGoalsMain: number;
    halfTimeGoalsOpponent: number;
    aetGoalsMain?: number;
    aetGoalsOpponent?: number;
    psoGoalsMain?: number;
    psoGoalsOpponent?: number;
    venue: GameVenueDto;
    leg?: number;
    previousLeg?: BasicGameDto;
    isNeutralGround: boolean;
    scheduled?: Date;
    href: string;
}