import { OverallPosition } from "@src/model/type/position-overall";

export interface SquadDaoInterface {
    id: number;
    seasonId: number;
    personId: number;
    overallPosition: OverallPosition;
    shirt?: number;
}