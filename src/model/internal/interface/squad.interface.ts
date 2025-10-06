import { OverallPosition } from "@src/model/type/position-overall";
import { DateString } from "@src/util/domain-types";

export interface SquadDaoInterface {
    id: number;
    seasonId: number;
    personId: number;
    overallPosition: OverallPosition;
    shirt?: number;
    start?: DateString;
    end?: DateString;
    loan?: boolean;
}