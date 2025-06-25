import { SmallClubDto } from "./small-club";
import { SmallCompetitionDto } from "./small-competition";
import { SmallSeasonDto } from "./small-season";

export type PlayerSeasonStatsItemDto = {
    season: SmallSeasonDto;
    competitions: Array<PlayerCompetitionStatsItemDto>;
}

export type PlayerSubCompetitionStatsItemDto = {
    isParent?: boolean;
    competition?: SmallCompetitionDto;
    stats: PlayerStatsItemDto;
}

export type PlayerCompetitionStatsItemDto = {
    competition: SmallCompetitionDto;
    items: Array<PlayerSubCompetitionStatsItemDto>;
}

export type PlayerStatsItemDto = {
    gamesPlayed?: number;
    gamesStarted?: number;
    goalsScored?: number;
    assists?: number;
    minutesPlayed?: number;
    ownGoals?: number;
    goalsConceded?: number;
    cleanSheets?: number;
    yellowCards?: number;
    yellowRedCards?: number;
    redCards?: number;
    penaltiesTaken?: [number, number],
    penaltiesFaced?: [number, number],
    psoPenaltiesTaken?: [number, number],
    psoPenaltiesFaced?: [number, number],
}

export type PlayerGoalsAgainstClubStatsItemDto = {
    club: SmallClubDto;
    goalsScored: number;
}