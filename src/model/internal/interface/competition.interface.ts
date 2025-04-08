export interface CompetitionDaoInterface {
    id: number;
    name: string;
    shortName: string;
    isDomestic: boolean;
    parentId?: number;
}