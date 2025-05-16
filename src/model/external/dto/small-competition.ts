export interface SmallCompetitionDto {
    id: number;
    name: string;
    shortName: string;
    iconSmall?: string;
    iconLarge?: string;
    parent?: SmallCompetitionDto;
}