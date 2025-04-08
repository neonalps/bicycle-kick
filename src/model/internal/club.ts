export interface Club {
    id: number;
    name: string;
    shortName: string;
    city: string;
    district?: string;
    countryCode: string;
    iconLarge?: string;
    iconSmall?: string;
    primaryColour?: string;
    secondaryColour?: string;
    homeVenueId?: number;
}