import { ScoreTuple } from "@src/model/internal/score";

export type Club = {
    id?: number;
    name: string;
}

export type Fixture = {
    kickoff: string;
    home: Club;
    away: Club;
    fullTime: ScoreTuple;
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

export type MatchdayDetails = {
    fixtures?: Fixture[];
    table?: TablePosition[];
}