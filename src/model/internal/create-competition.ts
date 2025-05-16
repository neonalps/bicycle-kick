export interface CreateCompetition {
    name: string;
    shortName: string;
    isDomestic: boolean;
    parentId?: number;
    combineStatisticsWithParent?: boolean;
    iconLarge?: string;
    iconSmall?: string;
    normalizedSearch: string;
} 