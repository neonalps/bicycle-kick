import { BasicPersonDto } from "./basic-person";
import { GamePlayerDto } from "./game-player";

export interface TeamGameReportDto {
    starting: GamePlayerDto[];
    substitutes: GamePlayerDto[];
    managers: BasicPersonDto[];
}