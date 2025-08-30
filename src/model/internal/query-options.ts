import { ClubId, CompetitionId, SeasonId } from "@src/util/domain-types";

export interface QueryOptions {
    onlySeasons?: ReadonlyArray<SeasonId>,
    onlyOpponents?: ReadonlyArray<ClubId>,
    onlyCompetitions?: ReadonlyArray<CompetitionId>,
    onlyHome?: boolean,
    onlyAway?: boolean, 
    excludeNeutralGround?: boolean,
    onlyDomestic?: boolean,
    onlyInternational?: boolean,
    onlyForMain?: boolean;
}