import { CompetitionId } from "@src/util/domain-types";

export interface BasicCompetitionDto {
    id: CompetitionId;
    name: string;
    shortName: string;
    isDomestic: boolean;
    iconSmall?: string;
    iconLarge?: string;
    parentCompetitionId?: CompetitionId;
    combineStatisticsWithParent?: boolean;
    sortOrder: number;
}