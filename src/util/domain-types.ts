import { Flavor } from "./types";

export type AccountId = Flavor<number, 'AccountId'>;
export type DateString = Flavor<string, 'DateString'>;
export type ClubId = Flavor<number, 'ClubId'>;
export type CompetitionId = Flavor<number, 'CompetitionId'>;
export type GameId = Flavor<number, 'GameId'>;
export type PersonId = Flavor<number, 'PersonId'>;
export type SeasonId = Flavor<number, 'SeasonId'>;