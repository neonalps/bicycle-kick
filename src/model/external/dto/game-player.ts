import { SmallPersonDto } from "./small-person";

export interface GamePlayerDto {
    id: number;
    player: SmallPersonDto;
    shirt: number;
    positionKey?: string;
    positionGrid?: number;
    goalsConceded?: number;
    goalsScored?: number;
    assists?: number;
    ownGoals?: number;
    captain?: boolean;
    starting?: boolean;
    yellowCard?: string;
    yellowRedCard?: string;
    redCard?: string;
    regulationPenaltiesTaken?: number;
    regulationPenaltiesScored?: number;
    regulationPenaltiesFaced?: number;
    regulationPenaltiesSaved?: number;
    psoPenaltiesTaken?: number;
    psoPenaltiesScored?: number;
    psoPenaltiesFaced?: number;
    psoPenaltiesSaved?: number;
    off?: string;
    on?: string;
}