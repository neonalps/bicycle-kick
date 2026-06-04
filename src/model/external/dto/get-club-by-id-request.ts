export interface GetClubByIdRequestDto {
    clubId: number;
    includeAllGames?: boolean;
    includeLastGames?: boolean;
    includeHomeVenue?: boolean;
}