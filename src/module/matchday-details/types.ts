import { Club } from "@src/model/internal/club";
import { Competition } from "@src/model/internal/competition";
import { ScoreTuple } from "@src/model/internal/score";
import { Season } from "@src/model/internal/season";
import { GameStatus } from "@src/model/type/game-status";
import { DateString } from "@src/util/domain-types";

export type FetchMatchdayDetailsRequest = {
    season: Season;
    competition: Competition;
    competitionStage: string;
    competitionRound: string;
}

export type MatchdayDetails = {
    fixtures?: Fixture[];
    table?: TablePosition[];
    competition: Competition;
    season: Season;
}

export type Fixture = {
    kickoff: DateString;
    status: GameStatus;
    home: Club;
    away: Club;
    fullTime?: ScoreTuple;
    halfTime?: ScoreTuple;
    afterExtraTime?: ScoreTuple;
    afterPenaltyShootOut?: ScoreTuple;
    href?: string;
}

export type TablePosition = {
    position: number;
    club: Club;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    gamesPlayed: number;
    wins: number;
    draws: number;
    defeats: number;
}

export type ExternalClub = {
    id?: number;
    name: string;
}

export type ExternalFixture = {
    kickoff: string;
    status: GameStatus;
    home: ExternalClub;
    away: ExternalClub;
    fullTime?: ScoreTuple;
    halfTime?: ScoreTuple;
    afterExtraTime?: ScoreTuple;
    afterPenaltyShootOut?: ScoreTuple;
    href?: string;
}

export type ExternalTablePosition = {
    position: number;
    club: ExternalClub;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    gamesPlayed: number;
    wins: number;
    draws: number;
    defeats: number;
}

export type ExternalMatchdayDetails = {
    fixtures?: ExternalFixture[];
    table?: ExternalTablePosition[];
}