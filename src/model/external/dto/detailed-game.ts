import { BasicGameDto } from "./basic-game";
import { GameAbsenceDto } from "./game-absence";
import { GameReportDto } from "./game-report";

export interface DetailedGameDto extends BasicGameDto {
    absences?: GameAbsenceDto[],
    report: GameReportDto,
}