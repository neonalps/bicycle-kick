import { GameStatus } from "@src/model/type/game-status";
import { ClubInputDto } from "@src/model/external/dto/club-input";
import { CompetitionInputDto } from "@src/model/external/dto/competition-input";
import { VenueInputDto } from "@src/model/external/dto/venue-input";
import { CreateGamePlayerDto } from "@src/model/external/dto/create-game-player";
import { CreateGameManagerDto } from "@src/model/external/dto/create-game-manager";
import { CreateGameRefereeDto } from "@src/model/external/dto/create-game-referee";
import { CreateGameEventDto } from "@src/model/external/dto/create-game-event";
import { GameInputDto } from "../external/dto/game-input";

export interface CreateGameDto {
    kickoff: Date;
    seasonId: number;
    opponent: ClubInputDto;
    competition: CompetitionInputDto;
    competitionRound: string;
    isHomeGame: boolean;
    status: GameStatus;
    venue: VenueInputDto;
    attendance?: number;
    isNeutralGround: boolean;
    isSoldOut?: boolean;
    tacticalFormationMain?: string;
    tacticalFormationOpponent?: string;
    tablePositionMainBefore?: number;
    tablePositionOpponentBefore?: number;
    tablePositionMainAfter?: number;
    tablePositionOpponentAfter?: number;
    tablePositionOffset?: number;
    leg?: number;
    previousLeg?: GameInputDto;
    isPractice: boolean;
    lineupMain: CreateGamePlayerDto[];
    lineupOpponent: CreateGamePlayerDto[];
    managersMain: CreateGameManagerDto[];
    managersOpponent: CreateGameManagerDto[];
    referees: CreateGameRefereeDto[];
    events: CreateGameEventDto[];
}