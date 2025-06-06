export interface CompetitionDaoInterface {
    id: number;
    name: string;
    shortName: string;
    isDomestic: boolean;
    iconSmall?: string;
    iconLarge?: string;
    parentId?: number;
    combineStatisticsWithParent?: boolean;
    normalizedSearch: string;
}