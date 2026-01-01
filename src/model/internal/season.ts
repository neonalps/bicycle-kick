import { SeasonId } from "@src/util/domain-types";

export interface Season {
    id: SeasonId;
    name: string;
    shortName: string;
    start: Date;
    end: Date;
}