export interface SmallCompetitionDto {
    id: number;
    name: string;
    shortName: string;
    parent?: SmallCompetitionDto;
}