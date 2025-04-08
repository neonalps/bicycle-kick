import { GameEventDto } from "./game-event";
import { TeamGameReportDto } from "./game-report-team";

export interface GameReportDto {
    main: TeamGameReportDto;
    opponent: TeamGameReportDto;
    events: GameEventDto[];
}