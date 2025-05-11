import { GameEventDto } from "./game-event";
import { GameRefereeDto } from "./game-referee";
import { TeamGameReportDto } from "./game-report-team";

export interface GameReportDto {
    main: TeamGameReportDto;
    opponent: TeamGameReportDto;
    events: GameEventDto[];
    referees: GameRefereeDto[];
}