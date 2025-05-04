import { ExternalCompetitionDto } from "./external-competition";

export interface CompetitionInputDto {
    competitionId?: number;
    externalCompetition?: ExternalCompetitionDto;
}