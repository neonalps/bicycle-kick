import { GameManagerDto } from "./game-manager";
import { GamePlayerDto } from "./game-player";
import { TacticalFormation } from "./tactical-formation";

export interface TeamGameReportDto {
    lineup: GamePlayerDto[];
    managers: GameManagerDto[];
    tacticalFormation?: TacticalFormation;
}