export interface CreateClub {
    name: string;
    shortName: string;
    iconLarge?: string;
    iconSmall?: string;
    city: string;
    district?: string;
    countryCode: string;
    primaryColour?: string;
    secondaryColour?: string;
    homeVenueId?: number;
    normalizedSearch: string;
}