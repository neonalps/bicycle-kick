import { GameStatus } from "@src/model/type/game-status";
import { ClubInputDto } from "@src/model/external/dto/club-input";
import { CompetitionInputDto } from "@src/model/external/dto/competition-input";
import { VenueInputDto } from "@src/model/external/dto/venue-input";
import { GameInputDto } from "@src/model/external/dto/game-input";
import { DateString, SeasonId } from "@src/util/domain-types";
import { CreateGameRefereeDto } from "@src/model/external/dto/create-game-referee";

export interface UpdateGameDto {
    kickoff: DateString;
    seasonId: SeasonId;
    opponent: ClubInputDto;
    competition: CompetitionInputDto;
    competitionStage?: string;
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
    referees?: CreateGameRefereeDto[];
}