import { OverallPosition } from "@src/model/type/position-overall";

export interface SquadMember {
    id: number;
    seasonId: number;
    personId: number;
    overallPosition: OverallPosition;
    shirt?: number;
    from?: string;
    to?: string;
    loan?: boolean;
}