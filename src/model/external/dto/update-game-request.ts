import { GameStatus } from "@src/model/type/game-status";
import { ClubInputDto } from "./club-input";
import { CompetitionInputDto } from "./competition-input";
import { VenueInputDto } from "./venue-input";
import { GameInputDto } from "./game-input";
import { DateString, GameId } from "@src/util/domain-types";
import { CreateGameRefereeDto } from "./create-game-referee";

export interface UpdateGameRequestDto {
    gameId: GameId;
    kickoff: DateString;
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
    leg?: number;
    previousLeg?: GameInputDto;
    referees?: CreateGameRefereeDto[];
}