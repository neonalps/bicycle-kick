export interface GetPersonByIdRequestDto {
    personId: string;
    includeContract?: boolean;
    includeStatistics?: boolean;
}