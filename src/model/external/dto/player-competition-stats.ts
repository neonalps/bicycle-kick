import { BasicPersonDto } from "./basic-person";
import { SmallCompetitionDto } from "./small-competition";

export interface RankedPersonResultItemDto {
    rank: number;
    person: BasicPersonDto;
    value: number;
}

export interface PlayerCompetitionStatsDto {
    competitions: SmallCompetitionDto[];
    ranking: RankedPersonResultItemDto[];
}