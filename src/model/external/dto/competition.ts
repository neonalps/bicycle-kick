export interface CompetitionDto {
    id: number;
    name: string;
    shortName: string;
    isDomestic: boolean;
    parent?: CompetitionDto;
    combineStatisticsWithParent?: boolean;
}