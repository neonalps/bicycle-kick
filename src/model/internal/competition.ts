export interface Competition {
    id: number;
    name: string;
    shortName: string;
    isDomestic: boolean;
    parentId?: number;
    combineStatisticsWithParent?: boolean;
}