export interface GetClubByIdRequestDto {
    clubId: string;
    includeAllGames?: boolean;
    includeLastGames?: boolean;
    includeHomeVenue?: boolean;
}