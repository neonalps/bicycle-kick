import { BasicClubDto } from "./basic-club";
import { CompetitionDto } from "./competition";
import { GameVenueDto } from "./game-venue";

export interface BasicGameDto {
    id: number;
    opponent: BasicClubDto;
    scheduled: Date;
    competition: CompetitionDto;
    round: string;
    isHomeGame: boolean;
    status: string;
    resultTendency: string;
    resultMainFullTime: number;
    resultOpponentFullTime: number;
    venue: GameVenueDto;
    leg?: number;
    previousLeg?: BasicGameDto;
    isInternationalGame: boolean;
    isNeutralGround: boolean;
    href: string;
}