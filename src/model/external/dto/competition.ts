export interface CompetitionDto {
    id: number;
    name: string;
    shortName: string;
    isDomestic: boolean;
    parentCompetition?: CompetitionDto;
    combineStatisticsWithParent?: boolean;
}