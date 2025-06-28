import { BasicPersonDto } from "./basic-person";

export interface SquadMemberDto {
    id: number;
    player: BasicPersonDto;
    shirt?: number;
    from?: string;
    to?: string;
}