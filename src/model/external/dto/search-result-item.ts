import { SearchEntity } from "@src/module/search/entities";
import { BasicClubDto } from "./basic-club";
import { DateString } from "@src/util/domain-types";

export type GameResult = {
    fullTime: [number, number],
    halfTime: [number, number],
    afterExtraTime?: [number, number],
    penaltyShootOut?: [number, number],
};

export type GameSearchResultContext = {
    opponent: BasicClubDto;
    kickoff: DateString;
    isHomeGame: boolean;
    result?: GameResult;
};

export interface SearchResultItemDto {
    type: SearchEntity,
    entityId: number;
    icon?: string;
    title: string;
    sub?: string;
    popularity?: number;
    context?: Record<string, unknown>;
}