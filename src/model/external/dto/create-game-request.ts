import { GameStatus } from "@src/model/type/game-status";
import { CreateGamePlayerDto } from "./create-game-player";
import { CreateGameEventDto } from "./create-game-event";
import { CreateGameRefereeDto } from "./create-game-referee";
import { CreateGameManagerDto } from "./create-game-manager";

export interface CreateGameRequestDto {
    seasonId: number;
    kickoff: Date;
    opponentId: number;
    competitionId: number;
    competitionRound: string;
    isHomeGame: boolean;
    status: GameStatus;
    venueId: number;
    attendance?: number;
    isNeutralGround: boolean;
    isSoldOut?: boolean;
    tablePositionMainBefore?: number;
    tablePositionOpponentBefore?: number;
    tablePositionMainAfter?: number;
    tablePositionOpponentAfter?: number;
    tablePositionOffset?: number;
    leg?: number;
    previousLeg?: number;
    isPractice: boolean;
    lineupMain: CreateGamePlayerDto[];
    lineupOpponent: CreateGamePlayerDto[];
    managersMain: CreateGameManagerDto[];
    managersOpponent: CreateGameManagerDto[];
    events: CreateGameEventDto[];
    referees: CreateGameRefereeDto[];
}