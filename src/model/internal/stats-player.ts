import { ClubId, CompetitionId, PersonId, SeasonId } from "@src/util/domain-types";
import { Competition } from "./competition";
import { Season } from "./season";
import { Club } from "./club";

export type PlayerStatsResult = {
    clubs: Map<ClubId, Club>;
    competitions: Map<CompetitionId, Competition>;
    seasons: Map<SeasonId, Season>;
    performance?: Map<PersonId, Map<SeasonId, Map<CompetitionId, PlayerBaseStats>>>;
    goalsAgainstClub?: Map<PersonId, Array<PlayerGoalsAgainstClubStatsItem>>;
}

export type PlayerStatsMapContext = {
    seasons: Map<SeasonId, Season>;
    competitions: Map<CompetitionId, Competition>;
    playerStats: Map<PersonId, Map<SeasonId, Map<CompetitionId, PlayerBaseStats>>>;
}

export interface PlayerBaseStats {
    gamesPlayed: number;
    goalsScored: number;
    assists: number;
    ownGoals: number;
    goalsConceded: number;
    cleanSheets: number;
    minutesPlayed: number;
    gamesStarted: number;
    yellowCards: number;
    yellowRedCards: number;
    redCards: number;
    regulationPenaltiesTaken: number;
    regulationPenaltiesScored: number;
    regulationPenaltiesFaced: number;
    regulationPenaltiesSaved: number;
    psoPenaltiesTaken: number;
    psoPenaltiesScored: number;
    psoPenaltiesFaced: number;
    psoPenaltiesSaved: number;
}

export interface PlayerSeasonCompetitionStats extends PlayerBaseStats {
    seasonId: number;
    competitionId: number;
}

export interface CompetitionPlayerStatsDetails extends Omit<PlayerSeasonCompetitionStats, 'seasonId' | 'competitionId'> {
    competition: Competition;
}

export interface PlayerStatsDetails {
    season?: Season;        // no season indicates they are the overall stats for the player
    competitions: CompetitionPlayerStatsDetails[];
}

export interface PlayerGoalsAgainstClubStatsItem {
    clubId: number;
    goalsScored: number;
}