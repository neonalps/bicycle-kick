import { SquadMember } from "@src/model/internal/squad-member";
import { OverallPosition } from "@src/model/type/position-overall";

export function getEmptySquad(): Record<OverallPosition, SquadMember[]> {
    return {
        goalkeeper: [],
        defender: [],
        midfielder: [],
        forward: [],
    }
}