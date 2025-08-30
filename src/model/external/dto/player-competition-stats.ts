import { BasicPersonDto } from "./basic-person";
import { SmallCompetitionDto } from "./small-competition";

export interface PlayerCompetitionItemDto {
    rank: number;
    player: BasicPersonDto;
    value: number;
}

export interface PlayerCompetitionStatsDto {
    competitions: SmallCompetitionDto[];
    ranking: PlayerCompetitionItemDto[];
}