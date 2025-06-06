import { GameManagerDto } from "./game-manager";
import { GamePlayerDto } from "./game-player";

export interface TeamGameReportDto {
    lineup: GamePlayerDto[];
    managers: GameManagerDto[];
}