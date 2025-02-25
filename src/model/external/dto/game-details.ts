import { BasicClubDto } from "./basic-club";
import { BasicGameDto } from "./basic-game";
import { CompetitionDto } from "./competition";
import { GameEventDto } from "./game-event";
import { GameVenueDto } from "./game-venue";
import { RefereeDto } from "./referee";
import { GamePlayerDto } from "./game-player";

export interface GameDetailsDto {
    id: number;
    opponent: BasicClubDto;
    scheduled: Date;
    competition: CompetitionDto;
    round: string;
    isHomeGame: boolean;
    status: string;
    resultTendency: string;
    resultMainFullTime?: number;
    resultOpponentFullTime?: number;
    resultMainHalfTime?: number;
    resultOpponentHalfTime?: number;
    venue: GameVenueDto;
    leg?: number;
    lineupMain: GamePlayerDto[];
    lineupOpponent: GamePlayerDto[];
    events?: GameEventDto[];
    referees?: RefereeDto[];
    previousLeg?: BasicGameDto;
    isInternationalGame: boolean;
    isNeutralGround: boolean;
    resultMainAfterAet?: number;
    resultOpponentAfterAet?: number;
    resultMainAfterPso?: number;
    resultOpponentAfterPso?: number;
}