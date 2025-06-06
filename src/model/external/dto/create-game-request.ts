import { GameStatus } from "@src/model/type/game-status";
import { CreateGamePlayerDto } from "./create-game-player";
import { CreateGameEventDto } from "./create-game-event";
import { CreateGameRefereeDto } from "./create-game-referee";
import { CreateGameManagerDto } from "./create-game-manager";
import { ClubInputDto } from "./club-input";
import { CompetitionInputDto } from "./competition-input";
import { VenueInputDto } from "./venue-input";
import { GameInputDto } from "./game-input";

export interface CreateGameRequestDto {
    kickoff: Date;
    opponent: ClubInputDto;
    competition: CompetitionInputDto;
    competitionRound: string;
    competitionStage?: string;
    isHomeGame: boolean;
    status: GameStatus;
    venue: VenueInputDto;
    attendance?: number;
    isNeutralGround?: boolean;
    isPractice?: boolean;
    isSoldOut?: boolean;
    lineupMain: CreateGamePlayerDto[];
    lineupOpponent: CreateGamePlayerDto[];
    managersMain: CreateGameManagerDto[];
    managersOpponent: CreateGameManagerDto[];
    events: CreateGameEventDto[];
    referees: CreateGameRefereeDto[];
    leg?: number;
    previousLeg?: GameInputDto;
}