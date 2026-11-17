export interface CreateClubRequestDto {
    name: string;
    shortName: string;
    primaryColour?: string;
    secondaryColour?: string;
    city: string;
    district?: string;
    countryCode: string;
    homeVenueFlavorId: string;
}