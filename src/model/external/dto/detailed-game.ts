import { BasicGameDto } from "./basic-game";
import { GameReportDto } from "./game-report";

export interface DetailedGameDto extends BasicGameDto {
    report: GameReportDto,
}